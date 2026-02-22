import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/send-email/route';

const mocks = vi.hoisted(() => {
  const sendMailMock = vi.fn();
  const createTransportMock = vi.fn(() => ({
    sendMail: sendMailMock,
  }));

  return { sendMailMock, createTransportMock };
});

vi.mock('nodemailer', () => {
  return {
    default: {
      createTransport: mocks.createTransportMock,
    },
  };
});

// Mock global fetch pour la validation reCAPTCHA
const originalFetch = global.fetch;
const mockFetch = vi.fn();

describe('POST /api/send-email', () => {
  beforeEach(() => {
    process.env.GMAIL_USER = 'automation@example.com';
    process.env.GMAIL_APP_PASSWORD = 'app-password';
    process.env.CONTACT_EMAIL = 'contact@jvnr.fr';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key';

    mocks.sendMailMock.mockReset();
    mocks.createTransportMock.mockClear();
    mocks.sendMailMock.mockResolvedValue({
      messageId: 'test-message',
      response: '250 OK',
      accepted: ['contact@jvnr.fr'],
      rejected: [],
    });

    // Mock fetch pour la validation reCAPTCHA (réponse de l'API Google)
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, score: 0.9 }),
    });
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllTimers();
    global.fetch = originalFetch;
  });

  it('returns success when payload is valid', async () => {
    const payload = {
      name: 'Alice',
      email: 'alice@example.com',
      phone: '',
      company: '',
      message: 'Bonjour, je souhaite un devis.',
      formType: 'onepage',
      recaptchaToken: 'valid-test-token',
    };

    const request = new NextRequest('http://localhost/api/send-email/', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({ success: true });
    expect(mocks.createTransportMock).toHaveBeenCalledTimes(1);
    expect(mocks.sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('Site One Page'),
        replyTo: 'alice@example.com',
      }),
    );
  });

  it('rejects invalid payload', async () => {
    const request = new NextRequest('http://localhost/api/send-email/', {
      method: 'POST',
      body: JSON.stringify({ email: 'incomplete@example.com' }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.2',
      },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toMatchObject({
      error: expect.stringContaining('Le nom et l\'email sont requis'),
    });
    expect(mocks.sendMailMock).not.toHaveBeenCalled();
  });
});

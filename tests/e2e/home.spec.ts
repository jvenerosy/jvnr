import { test, expect } from '@playwright/test';

test.describe('Homepage smoke test', () => {
  test('renders key sections and CTA navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'JVNR' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Nos Tarifs' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voir nos offres' })).toBeVisible();

    await page.getByRole('button', { name: 'Voir nos offres' }).click();
    await expect(page.locator('#pricing')).toBeInViewport();
  });
});

import type { MetadataRoute } from 'next';

const BASE_URL = 'https://jvnr.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}

import { MetadataRoute } from 'next';
import { MOCK_TOUR_PACKAGES } from '@/lib/mock-data/tour-packages';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tourplatform.example.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/services',
    '/tour-packages',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  const tourRoutes: MetadataRoute.Sitemap = MOCK_TOUR_PACKAGES.map((pkg) => ({
    url: `${baseUrl}/tour-packages#${pkg.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    ...staticRoutes,
    ...tourRoutes,
  ];
}

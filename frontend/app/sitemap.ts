import { MetadataRoute } from 'next';
import { getAllTourPackages } from '@/services/tour.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trackyourtrip.example.com';

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

  const packages = await getAllTourPackages();

  const tourRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${baseUrl}/tour-packages/${pkg.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    ...staticRoutes,
    ...tourRoutes,
  ];
}

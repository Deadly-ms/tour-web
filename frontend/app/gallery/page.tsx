import type { Metadata } from 'next';
import { GalleryPage } from '@/components/wanderly/gallery/GalleryPage';

export const metadata: Metadata = {
  title: 'Photo Gallery | Track Your Trip',
  description:
    'Captured moments from our journeys and scenic routes — desert dunes, Himalayan skies, quiet beaches and heritage stays.',
};

export default function Page() {
  return <GalleryPage />;
}
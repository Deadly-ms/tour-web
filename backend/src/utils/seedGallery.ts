import { Gallery } from '../models/Gallery';

export const INITIAL_GALLERY_PHOTOS = [
  {
    title: 'Golden Thar Dunes',
    caption: 'Sunset ripples across the vast desert dunes outside Jaisalmer.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    category: 'Moments',
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Himalayan Stargazing',
    caption: 'Clear galactic skies glowing over snow-clad jagged peaks in Spiti Valley.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    category: 'Moments',
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'Alpine Lake Reflections',
    caption: 'Pristine glacial waters capturing the morning alpenglow.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: 'Moments',
    displayOrder: 3,
    isPublished: true,
  },
  {
    title: 'Quiet Palm Shorelines',
    caption: 'Turquoise ocean swells touching untouched beaches of South Goa.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: 'Coastal',
    displayOrder: 4,
    isPublished: true,
  },
  {
    title: 'Road to Adventure',
    caption: 'Following the open highway across dramatic mountain switchbacks.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    category: 'Adventure',
    displayOrder: 5,
    isPublished: true,
  },
  {
    title: 'Private Journeys',
    caption: 'Unhurried routes with a guide who knows every story along the way.',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    category: 'Heritage',
    displayOrder: 6,
    isPublished: true,
  },
  {
    title: 'Luxury Stays',
    caption: 'Slow mornings at handpicked stays in beautiful locations.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    category: 'Luxury',
    displayOrder: 7,
    isPublished: true,
  },
  {
    title: 'Cultural Immersion',
    caption: 'Meeting local artisans and tasting food made the traditional way.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    category: 'Culture',
    displayOrder: 8,
    isPublished: true,
  },
  {
    title: 'Varanasi Ghat Dawn',
    caption: 'Golden morning light illuminating wooden boats and prayer bells by the Ganges.',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    category: 'Heritage',
    displayOrder: 9,
    isPublished: true,
  },
  {
    title: 'Kerala Backwaters Drift',
    caption: 'Traditional thatched houseboat sailing through serene emerald lagoons.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    category: 'Coastal',
    displayOrder: 10,
    isPublished: true,
  },
  {
    title: 'Jaipur Amber Fort',
    caption: 'Majestic yellow sandstone walls towering over Maota Lake at midday.',
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    category: 'Heritage',
    displayOrder: 11,
    isPublished: true,
  },
  {
    title: 'Ladakh High Passes',
    caption: 'Color-draped prayer flags fluttering against raw barren mountain summits.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: 'Adventure',
    displayOrder: 12,
    isPublished: true,
  },
  {
    title: 'Munnar Tea Slopes',
    caption: 'Endless undulating velvety emerald hills touched by delicate highland mist.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    category: 'Nature',
    displayOrder: 13,
    isPublished: true,
  },
  {
    title: 'Ranthambore Forest Gate',
    caption: 'Ancient banyan groves echoing with the deep calls of the wild.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    category: 'Wildlife',
    displayOrder: 14,
    isPublished: true,
  },
];

export const seedGallery = async (force = false): Promise<void> => {
  try {
    const count = await Gallery.countDocuments();
    if (count === 0 || force) {
      if (force) {
        await Gallery.deleteMany({});
      }
      await Gallery.insertMany(INITIAL_GALLERY_PHOTOS);
      console.log(`[Gallery Seed] Successfully seeded ${INITIAL_GALLERY_PHOTOS.length} curated gallery photos.`);
    }
  } catch (error) {
    console.error(`[Gallery Seed Error] Failed to seed gallery: ${(error as Error).message}`);
  }
};

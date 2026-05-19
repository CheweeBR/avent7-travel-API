export const CURATED_ICON_NAMES = [
  'Crown',
  'Gem',
  'Star',
  'Award',
  'Sparkles',
  'Diamond',
  'Briefcase',
  'Building2',
  'Coffee',
  'Plane',
  'Ship',
  'Anchor',
  'Train',
  'Car',
  'Palmtree',
  'Mountain',
  'Tent',
  'Compass',
  'MapPin',
  'Globe2',
  'Heart',
  'Users',
  'User',
  'Camera',
] as const;

export type CuratedIconName = (typeof CURATED_ICON_NAMES)[number];

export function isCuratedIcon(name: string): name is CuratedIconName {
  return (CURATED_ICON_NAMES as readonly string[]).includes(name);
}

export const DEFAULT_SEGMENT_SEEDS: Array<{
  name: string;
  icon: CuratedIconName;
  color: string;
  order: number;
}> = [
  { name: 'VIP',      icon: 'Crown',    color: 'var(--color-gold-bg)', order: 0 },
  { name: 'Premium',  icon: 'Gem',      color: 'var(--color-blue-bg)', order: 1 },
  { name: 'Standard', icon: 'User',     color: 'var(--muted)',         order: 2 },
];

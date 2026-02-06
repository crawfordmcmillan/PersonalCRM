export const SPHERES = ['Love Them', 'Like Them', 'Know Them'] as const
export type Sphere = (typeof SPHERES)[number]

export const SPHERE_DEFAULT_DAYS: Record<Sphere, number> = {
  'Love Them': 30,
  'Like Them': 90,
  'Know Them': 180,
}

export const CATEGORIES = ['personal', 'professional', 'family', 'acquaintance'] as const
export type Category = (typeof CATEGORIES)[number]

export const INTERACTION_TYPES = ['call', 'email', 'meeting', 'coffee', 'text', 'social', 'other'] as const
export type InteractionType = (typeof INTERACTION_TYPES)[number]

export const DIRECTIONS = ['inbound', 'outbound'] as const
export type Direction = (typeof DIRECTIONS)[number]

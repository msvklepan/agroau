export type FieldStatus = 'healthy' | 'warning' | 'critical'

export interface Field {
  id: string
  name: string
  crop: string
  cropEmoji: string
  color: string
  area: number
  status: FieldStatus
  ndvi: number
  moisture: number
  region: string
  province: string
  polygon: [number, number][]
  center: [number, number]
}

/**
 * Real Turkmenistan agricultural clusters:
 * - Ahal / Kaka etrap (37.35°N 59.61°E)  — Miwe agro-holding: almonds, fruit
 * - Mary / Yolöten (37.30°N 62.35°E)      — Türkmenpagta cotton clusters
 * - Dashoguz (41.83°N 59.97°E)            — critical saline zones
 */
export const FIELDS: Field[] = [
  // ─── Ahal Province · Kaka etrap · Miwe Agro-Holding ───
  {
    id: 'f01',
    name: 'Miwe-01 · Kaka',
    crop: 'Cotton',
    cropEmoji: '🌿',
    color: '#FF8C42',
    area: 480,
    status: 'critical',
    ndvi: 0.42,
    moisture: 28,
    region: 'Kaka etrap',
    province: 'Ahal Province',
    polygon: [
      [59.580, 37.370],[59.612, 37.376],
      [59.616, 37.344],[59.582, 37.338],
    ],
    center: [37.357, 59.599],
  },
  {
    id: 'f02',
    name: 'Miwe-02 · Kaka',
    crop: 'Almond',
    cropEmoji: '🌰',
    color: '#C5FF4A',
    area: 220,
    status: 'healthy',
    ndvi: 0.74,
    moisture: 55,
    region: 'Kaka etrap',
    province: 'Ahal Province',
    polygon: [
      [59.622, 37.380],[59.650, 37.385],
      [59.653, 37.355],[59.624, 37.350],
    ],
    center: [37.368, 59.638],
  },
  {
    id: 'f03',
    name: 'Miwe-03 · Kaka',
    crop: 'Melon',
    cropEmoji: '🍈',
    color: '#6EC6FF',
    area: 185,
    status: 'warning',
    ndvi: 0.61,
    moisture: 44,
    region: 'Kaka etrap',
    province: 'Ahal Province',
    polygon: [
      [59.584, 37.335],[59.614, 37.340],
      [59.616, 37.313],[59.586, 37.308],
    ],
    center: [37.324, 59.601],
  },

  // ─── Mary Province · Yolöten · Türkmenpagta Cotton ───
  {
    id: 'f04',
    name: 'Pagta-01 · Yolöten',
    crop: 'Cotton',
    cropEmoji: '🌿',
    color: '#FF8C42',
    area: 740,
    status: 'healthy',
    ndvi: 0.71,
    moisture: 48,
    region: 'Yolöten etrap',
    province: 'Mary Province',
    polygon: [
      [62.330, 37.295],[62.368, 37.300],
      [62.372, 37.265],[62.333, 37.260],
    ],
    center: [37.280, 62.352],
  },
  {
    id: 'f05',
    name: 'Pagta-02 · Yolöten',
    crop: 'Wheat',
    cropEmoji: '🌾',
    color: '#FBBF24',
    area: 530,
    status: 'healthy',
    ndvi: 0.79,
    moisture: 58,
    region: 'Yolöten etrap',
    province: 'Mary Province',
    polygon: [
      [62.375, 37.298],[62.408, 37.303],
      [62.411, 37.270],[62.377, 37.265],
    ],
    center: [37.284, 62.394],
  },

  // ─── Dashoguz Province · Critical Salinity Zone ───
  {
    id: 'f06',
    name: 'Daşoguz-S1',
    crop: 'Wheat',
    cropEmoji: '🌾',
    color: '#EF4444',
    area: 610,
    status: 'critical',
    ndvi: 0.38,
    moisture: 72,
    region: 'Köneürgench etrap',
    province: 'Dashoguz Province',
    polygon: [
      [59.950, 42.320],[59.990, 42.325],
      [59.993, 42.292],[59.952, 42.287],
    ],
    center: [42.306, 59.972],
  },
  {
    id: 'f07',
    name: 'Daşoguz-S2',
    crop: 'Cotton',
    cropEmoji: '🌿',
    color: '#F97316',
    area: 390,
    status: 'warning',
    ndvi: 0.45,
    moisture: 66,
    region: 'Köneürgench etrap',
    province: 'Dashoguz Province',
    polygon: [
      [60.000, 42.318],[60.030, 42.322],
      [60.032, 42.294],[60.002, 42.290],
    ],
    center: [42.306, 60.016],
  },
]

// For the map — regional cluster metadata (large zone circles)
export const CROP_REGIONS = [
  {
    id: 'ahal',
    name: 'Miwe Agro-Holding',
    subname: 'Kaka etrap · Ahal',
    center: [37.36, 59.60] as [number, number],
    radius: 8000,
    color: '#C5FF4A',
    icon: '🌰',
  },
  {
    id: 'mary',
    name: 'Türkmenpagta',
    subname: 'Yolöten · Mary',
    center: [37.28, 62.36] as [number, number],
    radius: 12000,
    color: '#FF8C42',
    icon: '🌿',
  },
  {
    id: 'dashoguz',
    name: 'Salinity Alert Zone',
    subname: 'Köneürgench · Dashoguz',
    center: [42.30, 59.97] as [number, number],
    radius: 10000,
    color: '#EF4444',
    icon: '⚗️',
  },
]

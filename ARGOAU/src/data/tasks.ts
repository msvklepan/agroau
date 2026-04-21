export type TaskStatus = 'in-progress' | 'pending' | 'completed'
export type TaskModule = 'code-red' | 'code-wall' | 'breeding' | 'irrigation' | 'harvest' | 'pruning' | 'transport' | 'fertilize'

export interface Task {
  id: string
  module: TaskModule
  title: string
  subtitle: string
  status: TaskStatus
  emoji: string
  bgColor: string
  season: string
  dates: string
  worker: string
  action: string
  progress: number
  fieldId?: string
}

export const TASKS: Task[] = [
  {
    id: 't1',
    module: 'code-red',
    title: 'Laser Eradication',
    subtitle: 'Code Red — Helicoverpa armigera',
    status: 'in-progress',
    emoji: '🎯',
    bgColor: '#FFF0E8',
    season: 'Summer 2025',
    dates: 'Jul 14 – Jul 20',
    worker: 'NVIDIA Jetson Unit 3',
    action: 'Targeting · Zone C4',
    progress: 59,
    fieldId: 'f01',
  },
  {
    id: 't2',
    module: 'irrigation',
    title: 'Cotton Irrigation',
    subtitle: 'Drip feed · Karakum Canal draw',
    status: 'in-progress',
    emoji: '💧',
    bgColor: '#E8F4FF',
    season: 'Summer 2025',
    dates: 'Jul 12 – Jul 18',
    worker: 'Auto-System A7',
    action: 'Active · Rows 1–24',
    progress: 67,
    fieldId: 'f01',
  },
  {
    id: 't3',
    module: 'transport',
    title: 'Transport Melon',
    subtitle: 'Cold-chain delivery · Ashgabat market',
    status: 'pending',
    emoji: '🚛',
    bgColor: '#FFF8E8',
    season: 'Summer 2025',
    dates: 'Jul 16 – Jul 17',
    worker: 'Logistics Unit B',
    action: 'Scheduled · 06:00',
    progress: 0,
    fieldId: 'f03',
  },
  {
    id: 't4',
    module: 'code-wall',
    title: 'Soil Twin Scan',
    subtitle: 'NPK · Salinity via Sentinel-2',
    status: 'pending',
    emoji: '🧪',
    bgColor: '#E8F4FF',
    season: 'Summer 2025',
    dates: 'Jul 15 – Jul 17',
    worker: 'Remote Sensing AI',
    action: 'Scheduled · 08:00',
    progress: 22,
  },
  {
    id: 't5',
    module: 'breeding',
    title: 'Genomic Selection',
    subtitle: 'Drought-resistant cotton hybrid',
    status: 'in-progress',
    emoji: '🧬',
    bgColor: '#EDFFF0',
    season: 'Summer 2025',
    dates: 'Jul 10 – Jul 30',
    worker: 'GNN-Hybrid v3.2',
    action: 'Simulating · 847 genotypes',
    progress: 74,
  },
  {
    id: 't6',
    module: 'fertilize',
    title: 'Fertilize Cotton',
    subtitle: 'Phase-2 NPK top-dressing',
    status: 'completed',
    emoji: '🌱',
    bgColor: '#EDFFF0',
    season: 'Summer 2025',
    dates: 'Jul 10',
    worker: 'Spreader Unit C',
    action: 'Completed',
    progress: 100,
    fieldId: 'f01',
  },
  {
    id: 't7',
    module: 'irrigation',
    title: 'Wheat Irrigation',
    subtitle: 'Automated schedule · TM-02',
    status: 'completed',
    emoji: '💧',
    bgColor: '#EEF9FF',
    season: 'Summer 2025',
    dates: 'Jul 13',
    worker: 'Auto-System A7',
    action: 'Completed',
    progress: 100,
    fieldId: 'f02',
  },
  {
    id: 't8',
    module: 'harvest',
    title: 'Cotton Harvest Forecast',
    subtitle: 'Yield prediction model v2',
    status: 'pending',
    emoji: '🌿',
    bgColor: '#FFF5F0',
    season: 'Summer 2025',
    dates: 'Sep 01 – Sep 20',
    worker: 'AI Yield Engine',
    action: 'Pending sensor data',
    progress: 5,
    fieldId: 'f01',
  },
  {
    id: 't9',
    module: 'harvest',
    title: 'Melon Harvest',
    subtitle: 'Manual picking · TM-03 Ahal',
    status: 'pending',
    emoji: '🍈',
    bgColor: '#FFFBEC',
    season: 'Summer 2025',
    dates: 'Jul 28 – Aug 05',
    worker: 'Crew Alpha · 6 workers',
    action: 'Queued',
    progress: 0,
    fieldId: 'f03',
  },
]

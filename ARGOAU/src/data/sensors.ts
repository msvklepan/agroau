export interface SensorReading {
  fieldId: string
  timestamp: string
  ndvi: number
  savi: number
  ndwi: number
  si2: number
  bsi: number
  temperature: number
  humidity: number
  ph: number
  ec: number
  nitrogen: number
  phosphorus: number
  potassium: number
}

export const SENSOR_DATA: SensorReading[] = [
  {
    fieldId: 'f01', timestamp: '2025-07-14T10:30:00Z',
    ndvi: 0.42, savi: 0.38, ndwi: 0.22, si2: 0.61, bsi: 0.44,
    temperature: 35, humidity: 28, ph: 7.8, ec: 3.2,
    nitrogen: 42, phosphorus: 18, potassium: 95,
  },
  {
    fieldId: 'f02', timestamp: '2025-07-14T10:30:00Z',
    ndvi: 0.78, savi: 0.72, ndwi: 0.55, si2: 0.28, bsi: 0.19,
    temperature: 33, humidity: 52, ph: 7.1, ec: 1.4,
    nitrogen: 78, phosphorus: 35, potassium: 142,
  },
  {
    fieldId: 'f03', timestamp: '2025-07-14T10:30:00Z',
    ndvi: 0.61, savi: 0.57, ndwi: 0.44, si2: 0.39, bsi: 0.31,
    temperature: 32, humidity: 44, ph: 6.9, ec: 1.8,
    nitrogen: 65, phosphorus: 28, potassium: 118,
  },
  {
    fieldId: 'f04', timestamp: '2025-07-14T10:30:00Z',
    ndvi: 0.69, savi: 0.63, ndwi: 0.48, si2: 0.32, bsi: 0.22,
    temperature: 34, humidity: 30, ph: 7.4, ec: 1.2,
    nitrogen: 55, phosphorus: 24, potassium: 108,
  },
  {
    fieldId: 'f05', timestamp: '2025-07-14T10:30:00Z',
    ndvi: 0.73, savi: 0.68, ndwi: 0.52, si2: 0.26, bsi: 0.17,
    temperature: 33, humidity: 48, ph: 6.8, ec: 0.9,
    nitrogen: 82, phosphorus: 40, potassium: 156,
  },
  {
    fieldId: 'f06', timestamp: '2025-07-14T10:30:00Z',
    ndvi: 0.38, savi: 0.34, ndwi: 0.28, si2: 0.62, bsi: 0.51,
    temperature: 34, humidity: 72, ph: 8.1, ec: 4.2,
    nitrogen: 38, phosphorus: 14, potassium: 88,
  },
  {
    fieldId: 'f07', timestamp: '2025-07-14T10:30:00Z',
    ndvi: 0.45, savi: 0.41, ndwi: 0.33, si2: 0.54, bsi: 0.43,
    temperature: 33, humidity: 66, ph: 7.9, ec: 3.5,
    nitrogen: 44, phosphorus: 18, potassium: 96,
  },
]

export const HOURLY_TEMP = [
  { hour: '06:00', temp: 24 },
  { hour: '08:00', temp: 28 },
  { hour: '10:00', temp: 32 },
  { hour: '12:00', temp: 36 },
  { hour: '14:00', temp: 38 },
  { hour: '16:00', temp: 36 },
  { hour: '18:00', temp: 32 },
  { hour: '20:00', temp: 28 },
  { hour: '22:00', temp: 25 },
]

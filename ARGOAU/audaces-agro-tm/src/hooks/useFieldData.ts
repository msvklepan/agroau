import { useState, useCallback } from 'react'
import { FIELDS } from '../data/fields'
import { TASKS } from '../data/tasks'
import { SENSOR_DATA } from '../data/sensors'

export function useFieldData() {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'brix' | 'salinity'>('ndvi')

  const selectedField = FIELDS.find(f => f.id === selectedFieldId) ?? null
  const selectedSensor = SENSOR_DATA.find(s => s.fieldId === selectedFieldId) ?? null
  const fieldTasks = TASKS.filter(t => t.fieldId === selectedFieldId)

  const selectField = useCallback((id: string | null) => setSelectedFieldId(id), [])

  return {
    fields: FIELDS,
    tasks: TASKS,
    sensors: SENSOR_DATA,
    selectedField,
    selectedSensor,
    fieldTasks,
    selectField,
    activeLayer,
    setActiveLayer,
  }
}

export type UseFieldData = ReturnType<typeof useFieldData>

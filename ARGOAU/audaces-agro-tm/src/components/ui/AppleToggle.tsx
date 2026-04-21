import { useState } from 'react'

interface Props {
  defaultOn?: boolean
  onChange?: (v: boolean) => void
  color?: string
}

export function AppleToggle({ defaultOn = false, onChange, color = '#34C759' }: Props) {
  const [on, setOn] = useState(defaultOn)

  function toggle() {
    const next = !on
    setOn(next)
    onChange?.(next)
  }

  return (
    <div
      className="ios-toggle-track"
      style={{ background: on ? color : '#E5E5EA' }}
      onClick={toggle}
      role="switch"
      aria-checked={on}
    >
      <div className={`ios-toggle-thumb ${on ? 'on' : ''}`} />
    </div>
  )
}

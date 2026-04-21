type Status = 'healthy' | 'warning' | 'critical' | 'pending'

const COLORS: Record<Status, string> = {
  healthy:  'bg-[#4ade80]',
  warning:  'bg-[#FF8C42]',
  critical: 'bg-[#ef4444]',
  pending:  'bg-[#6EC6FF]',
}

export function StatusDot({ status, size = 8 }: { status: Status; size?: number }) {
  return (
    <span
      className={`inline-block rounded-full ${COLORS[status]} ${status !== 'pending' ? 'dot-active' : ''}`}
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  )
}

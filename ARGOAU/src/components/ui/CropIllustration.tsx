import { CropIcon3D } from './CropIcon3D'

interface Props {
  emoji: string
  color: string
  size?: number
  crop?: string
}

export function CropIllustration({ emoji: _emoji, color, size = 56, crop }: Props) {
  return <CropIcon3D crop={crop ?? 'generic'} color={color} size={size} />
}

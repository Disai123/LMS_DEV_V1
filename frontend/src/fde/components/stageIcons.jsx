import {
  Brain,
  Building2,
  ClipboardList,
  CloudUpload,
  Code2,
  Layers,
  Lightbulb,
  Monitor,
  Package,
  Trophy,
} from 'lucide-react'

const MAP = {
  code: Code2,
  brain: Brain,
  'clipboard-list': ClipboardList,
  monitor: Monitor,
  layers: Layers,
  lightbulb: Lightbulb,
  package: Package,
  'cloud-upload': CloudUpload,
  building: Building2,
  trophy: Trophy,
}

export function StageIcon({ name, className = 'w-7 h-7', style }) {
  const Icon = MAP[name] || Code2
  return <Icon className={className} style={style} aria-hidden />
}

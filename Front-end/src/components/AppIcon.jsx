import {
  Clock,
  Compass,
  Chart,
  Flame,
  Gauge,
  Keyboard,
  Lock,
  Route,
  Spark,
  Target,
  Trophy,
  Zap,
} from './Icons'

const icons = {
  clock: Clock,
  compass: Compass,
  chart: Chart,
  flame: Flame,
  gauge: Gauge,
  keyboard: Keyboard,
  lock: Lock,
  route: Route,
  spark: Spark,
  target: Target,
  trophy: Trophy,
  zap: Zap,
}

export default function AppIcon({ name, ...props }) {
  const Icon = icons[name] ?? Spark
  return <Icon {...props} />
}

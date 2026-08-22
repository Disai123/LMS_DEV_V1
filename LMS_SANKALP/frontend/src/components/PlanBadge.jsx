import { Link } from 'react-router-dom';

const PLAN_CONFIG = {
  free: {
    label: 'Free',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-300',
    dot: 'bg-gray-400'
  },
  basic: {
    label: 'Basic',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    dot: 'bg-blue-500'
  },
  pro: {
    label: 'Pro',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
    dot: 'bg-purple-500'
  }
};

/**
 * Reusable plan badge chip
 * @param {string} plan  - 'free' | 'basic' | 'pro'
 * @param {string} size  - 'sm' | 'md' | 'lg'
 * @param {boolean} showDot - show colored dot
 */
const PlanBadge = ({ plan = 'free', size = 'sm', showDot = true }) => {
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.free;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
};

export default PlanBadge;

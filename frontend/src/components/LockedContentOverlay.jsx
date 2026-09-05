import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { PRICING_HIDDEN } from '../../config/features';

const PLAN_LABELS = {
  basic: 'Basic Plan',
  pro: 'Pro Plan'
};

const PLAN_COLORS = {
  basic: {
    bg: 'from-blue-600/90 to-indigo-700/90',
    btn: 'bg-blue-500 hover:bg-blue-400'
  },
  pro: {
    bg: 'from-purple-700/90 to-pink-700/90',
    btn: 'bg-purple-500 hover:bg-purple-400'
  }
};

/**
 * Lock overlay to render on top of inaccessible content cards.
 * @param {string} requiredPlan - 'basic' | 'pro'
 * @param {string} contentType  - 'course' | 'project' (shown in text)
 * @param {boolean} compact     - smaller variant for cards
 */
const LockedContentOverlay = ({ requiredPlan = 'basic', contentType = 'content', compact = false }) => {
  // HIDDEN: Pricing — never show lock overlay while pricing is hidden
  if (PRICING_HIDDEN) return null;

  const navigate = useNavigate();
  const colors = PLAN_COLORS[requiredPlan] || PLAN_COLORS.basic;
  const label = PLAN_LABELS[requiredPlan] || 'Basic Plan';

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-xl flex flex-col items-center justify-center text-white z-10 backdrop-blur-sm`}
    >
      <div className={`flex flex-col items-center gap-2 text-center px-4 ${compact ? 'gap-1.5' : 'gap-3'}`}>
        <div className={`rounded-full bg-white/20 ${compact ? 'p-2' : 'p-3'}`}>
          <Lock className={compact ? 'w-5 h-5' : 'w-7 h-7'} />
        </div>
        <div>
          <p className={`font-bold ${compact ? 'text-sm' : 'text-base'}`}>
            🔒 {label} Required
          </p>
          <p className={`text-white/80 mt-0.5 ${compact ? 'text-xs' : 'text-sm'}`}>
            Upgrade to unlock this {contentType}
          </p>
        </div>
        <button
          onClick={() => navigate('/pricing', { state: { highlightPlan: requiredPlan } })}
          className={`${colors.btn} text-white font-semibold rounded-lg transition-colors ${compact ? 'px-3 py-1 text-xs' : 'px-5 py-2 text-sm'}`}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default LockedContentOverlay;

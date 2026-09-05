import { useState, useEffect, useCallback } from 'react';
import { rbacService } from '../services/api';
import { PRICING_HIDDEN } from '../config/features';

const TIER_ORDER = { free: 0, basic: 1, pro: 2 };

const FULL_ACCESS = {
  planName: 'pro',
  tierOrder: 2,
  loading: false,
  hasAccess: () => true,
  refresh: () => {},
};

/**
 * Hook to get the current user's plan access info.
 * Returns { planName, tierOrder, loading, refresh }
 */
function usePlanAccess(user) {
  const userRole = user?.role;
  const userPlanType = user?.plan_type;
  const userId = user?.id;
  const [planName, setPlanName] = useState(PRICING_HIDDEN ? 'pro' : 'free');
  const [tierOrder, setTierOrder] = useState(PRICING_HIDDEN ? 2 : 0);
  const [loading, setLoading] = useState(!PRICING_HIDDEN);

  const fetch = useCallback(async () => {
    if (PRICING_HIDDEN) return;

    if (userRole === 'admin') {
      setPlanName('pro');
      setTierOrder(2);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setPlanName('free');
        setTierOrder(0);
        return;
      }
      const res = await rbacService.getMyPlanAccess();
      const data = res.data?.data || {};
      const safePlanName = (data.planName || 'free').toLowerCase();
      setPlanName(safePlanName);
      setTierOrder(data.tierOrder ?? TIER_ORDER[safePlanName] ?? 0);
    } catch {
      setPlanName('free');
      setTierOrder(0);
    } finally {
      setLoading(false);
    }
  }, [userRole, userId, userPlanType]);

  useEffect(() => {
    if (PRICING_HIDDEN) return;
    fetch();
  }, [fetch]);

  const hasAccess = useCallback((requiredPlan) => {
    if (PRICING_HIDDEN || userRole === 'admin') return true;
    const required = TIER_ORDER[requiredPlan] ?? 0;
    return tierOrder >= required;
  }, [tierOrder, userRole]);

  if (PRICING_HIDDEN) {
    return FULL_ACCESS;
  }

  return { planName, tierOrder, loading, hasAccess, refresh: fetch };
}

export default usePlanAccess;
export { TIER_ORDER };

import { useState, useEffect, useCallback } from 'react';
import { rbacService } from '../services/api';

const TIER_ORDER = { free: 0, basic: 1, pro: 2 };

/**
 * Hook to get the current user's plan access info.
 * Returns { planName, tierOrder, loading, refresh }
 */
function usePlanAccess(user) {
  const userRole = user?.role;
  const userPlanType = user?.plan_type;
  const userId = user?.id;
  const [planName, setPlanName] = useState('free');
  const [tierOrder, setTierOrder] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  /**
   * Check if the student has access to a resource with requiredPlan
   * @param {string} requiredPlan - 'free' | 'basic' | 'pro'
   * @returns {boolean}
   */
  const hasAccess = useCallback((requiredPlan) => {
    if (userRole === 'admin') return true;
    const required = TIER_ORDER[requiredPlan] ?? 0;
    return tierOrder >= required;
  }, [tierOrder, userRole]);

  return { planName, tierOrder, loading, hasAccess, refresh: fetch };
}

export default usePlanAccess;
export { TIER_ORDER };

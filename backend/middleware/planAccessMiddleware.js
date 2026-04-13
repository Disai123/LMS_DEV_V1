/**
 * Plan Access Middleware
 * Checks if the authenticated student's active subscription plan
 * meets the required_plan of the requested course or project.
 *
 * Usage:
 *   const { checkPlanAccess } = require('../middleware/planAccessMiddleware');
 *   router.get('/courses/:id/content', authenticate, checkPlanAccess('course'), controller);
 *   router.get('/projects/:id',         authenticate, checkPlanAccess('project'), controller);
 */

const { Subscription, Plan, Course, Project, User } = require('../models');
const { Op } = require('sequelize');

const TIER_ORDER = { free: 0, basic: 1, pro: 2 };

/**
 * Derive tier order from plan name (ground truth).
 * The plans.tier_order DB column defaults to 0 for all plans when not explicitly set,
 * so we ALWAYS resolve from plan name to guarantee correctness.
 */
function resolveTierOrder(planName, dbTierOrder) {
  const name = (planName || 'free').toLowerCase();
  // Plan name is authoritative — fall back to DB value only for unknown names
  if (TIER_ORDER[name] !== undefined) return TIER_ORDER[name];
  // Handle variations like 'Pro Plan', 'Basic Plan'
  if (name.includes('pro')) return 2;
  if (name.includes('basic')) return 1;
  if (name.includes('free')) return 0;
  // Last resort: DB value (only reliable if explicitly set)
  return (dbTierOrder != null && dbTierOrder > 0) ? dbTierOrder : 0;
}

/**
 * Get the student's current plan tier_order (0=free, 1=basic, 2=pro)
 * Returns 0 (free) if no active subscription found.
 */
async function getStudentTierOrder(userId) {
  // Admins always get full access
  const subscription = await Subscription.findOne({
    where: {
      user_id: userId,
      status: 'active',
      [Op.or]: [
        { end_date: null },
        { end_date: { [Op.gt]: new Date() } }
      ]
    },
    include: [{
      model: Plan,
      as: 'plan',
      attributes: ['name', 'tier_order']
    }],
    order: [['created_at', 'DESC']]
  });

  if (subscription && subscription.plan) {
    return resolveTierOrder(subscription.plan.name, subscription.plan.tier_order);
  }

  // Fallback to User model's plan_type if there's no Subscription record
  const user = await User.findByPk(userId, { attributes: ['plan_type'] });
  if (user && user.plan_type === 'premium') {
    return 2; // 'premium' correlates to Pro access
  }

  // No subscription → treat as free
  return 0;
}

/**
 * Factory function that returns the access-check middleware for a resource type.
 * @param {'course'|'project'} resourceType
 */
function checkPlanAccess(resourceType) {
  return async (req, res, next) => {
    try {
      // Admins bypass all plan checks
      if (req.user && req.user.role === 'admin') {
        return next();
      }

      // Must be authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Determine the resource ID
      const resourceId = req.params.id || req.params.courseId || req.params.projectId;
      if (!resourceId) {
        return next(); // No ID to check — let controller handle
      }

      // Fetch resource's required_plan
      let requiredPlan = 'free';
      if (resourceType === 'course') {
        const course = await Course.findByPk(resourceId, {
          attributes: ['id', 'required_plan']
        });
        if (!course) return next(); // Let controller return 404
        requiredPlan = course.required_plan || 'free';
      } else if (resourceType === 'project') {
        const project = await Project.findByPk(resourceId, {
          attributes: ['id', 'required_plan']
        });
        if (!project) return next();
        requiredPlan = project.required_plan || 'free';
      }

      const requiredTierOrder = TIER_ORDER[requiredPlan] ?? 0;

      // Get student's current tier
      const studentTierOrder = await getStudentTierOrder(req.user.id);

      if (studentTierOrder < requiredTierOrder) {
        return res.status(403).json({
          success: false,
          locked: true,
          required_plan: requiredPlan,
          message: `This content requires the "${requiredPlan}" plan or higher. Please upgrade your plan to access it.`
        });
      }

      // Access granted — attach plan tier to request for downstream use
      req.studentTierOrder = studentTierOrder;
      next();
    } catch (error) {
      console.error('Plan access check error:', error);
      next(error);
    }
  };
}

/**
 * Get full plan access details for the current user.
 * Returns: { planName, tierOrder }
 */
async function getStudentPlanInfo(userId) {
  const subscription = await Subscription.findOne({
    where: {
      user_id: userId,
      status: 'active',
      [Op.or]: [
        { end_date: null },
        { end_date: { [Op.gt]: new Date() } }
      ]
    },
    include: [{
      model: Plan,
      as: 'plan',
      attributes: ['id', 'name', 'tier_order', 'features']
    }],
    order: [['created_at', 'DESC']]
  });

  if (subscription && subscription.plan) {
    return {
      planName: subscription.plan.name,
      tierOrder: resolveTierOrder(subscription.plan.name, subscription.plan.tier_order),
      features: subscription.plan.features || {}
    };
  }

  // Fallback to User model's plan_type if there's no Subscription record
  const user = await User.findByPk(userId, { attributes: ['plan_type'] });
  if (user && user.plan_type === 'premium') {
    return { planName: 'pro', tierOrder: 2, features: {} };
  }

  return { planName: 'free', tierOrder: 0, features: {} };
}

module.exports = { checkPlanAccess, getStudentTierOrder, getStudentPlanInfo, TIER_ORDER };

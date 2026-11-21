const { StudentPermission } = require('../models');

const FEATURE_FIELD_MAP = {
  courses: 'courses',
  hackathons: 'hackathons',
  realtime_projects: 'realtime_projects',
  realtimeProjects: 'realtime_projects'
};

/**
 * Require StudentPermission feature flag for the authenticated student.
 * Admins always pass. Anonymous users pass only when allowAnonymous is true
 * (for optionalAuth catalog routes); otherwise 401.
 *
 * @param {'courses'|'hackathons'|'realtime_projects'|'realtimeProjects'} feature
 * @param {{ allowAnonymous?: boolean }} options
 */
function requireFeatureAccess(feature, options = {}) {
  const { allowAnonymous = false } = options;
  const dbField = FEATURE_FIELD_MAP[feature];

  if (!dbField) {
    throw new Error(`Invalid feature for requireFeatureAccess: ${feature}`);
  }

  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        if (allowAnonymous) {
          return next();
        }
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          locked: true,
          feature: dbField
        });
      }

      if (user.role === 'admin') {
        return next();
      }

      if (user.role !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
          locked: true,
          feature: dbField
        });
      }

      const permission = await StudentPermission.findOne({
        where: { student_id: user.id }
      });

      const hasAccess = permission ? permission[dbField] === true : false;

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: `You do not have access to ${dbField}. Contact your administrator.`,
          locked: true,
          feature: dbField
        });
      }

      return next();
    } catch (error) {
      console.error('Feature access check failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify feature access'
      });
    }
  };
}

module.exports = {
  requireFeatureAccess
};

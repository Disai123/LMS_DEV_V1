const { Internship, InternshipRegistration, User, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

/**
 * GET /api/internships
 * Public: returns published internships. Admin: returns all.
 */
const getAllInternships = async (req, res, next) => {
  try {
    const { q, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Optional auth: check if admin
    let user = req.user;
    if (!user && req.headers.authorization) {
      try {
        const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
        const token = extractTokenFromHeader(req.headers.authorization);
        if (token) {
          const decoded = verifyToken(token);
          user = await User.findByPk(decoded.id);
        }
      } catch (_) { /* public */ }
    }

    const conditions = [];
    if (!user || user.role !== 'admin') {
      conditions.push({ is_published: true });
    }
    if (status) conditions.push({ status });
    if (q) {
      conditions.push({
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } }
        ]
      });
    }

    const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

    const { count, rows: internships } = await Internship.findAndCountAll({
      where,
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        internships,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    next(new AppError('Failed to fetch internships', 500));
  }
};

/**
 * GET /api/internships/:id
 */
const getInternshipById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!internship) {
      return next(new AppError('Internship not found', 404));
    }
    if (!req.user || req.user.role !== 'admin') {
      if (!internship.is_published) {
        return next(new AppError('Internship not found', 404));
      }
    }

    res.json({ success: true, data: internship });
  } catch (error) {
    next(new AppError('Failed to fetch internship', 500));
  }
};

/**
 * POST /api/internships — Admin only
 */
const createInternship = async (req, res, next) => {
  try {
    const {
      title,
      description,
      logo,
      duration,
      mode,
      certificate_type,
      domains_offered,
      key_features,
      outcomes,
      highlights,
      status,
      max_registrations
    } = req.body;

    if (!title || !description) {
      return next(new AppError('Title and description are required', 400));
    }

    const internship = await Internship.create({
      title,
      description,
      logo,
      duration: duration || '4-12 Weeks',
      mode: mode || 'Online',
      certificate_type: certificate_type || 'Completion',
      domains_offered: domains_offered || [],
      key_features: key_features || [],
      outcomes: outcomes || [],
      highlights: highlights || [],
      status: status || 'active',
      max_registrations: max_registrations || null,
      created_by: req.user.id,
      updated_by: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: internship
    });
  } catch (error) {
    console.error('Error creating internship:', error);
    if (error.name === 'SequelizeValidationError') {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(new AppError('Failed to create internship', 500));
  }
};

/**
 * PUT /api/internships/:id — Admin only
 */
const updateInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByPk(id);
    if (!internship) {
      return next(new AppError('Internship not found', 404));
    }

    const updateData = { ...req.body, updated_by: req.user.id };
    delete updateData.created_by;
    delete updateData.current_registrations;

    await internship.update(updateData);
    res.json({ success: true, message: 'Internship updated successfully', data: internship });
  } catch (error) {
    console.error('Error updating internship:', error);
    next(new AppError('Failed to update internship', 500));
  }
};

/**
 * DELETE /api/internships/:id — Admin only
 */
const deleteInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByPk(id);
    if (!internship) {
      return next(new AppError('Internship not found', 404));
    }
    await internship.destroy();
    res.json({ success: true, message: 'Internship deleted successfully' });
  } catch (error) {
    next(new AppError('Failed to delete internship', 500));
  }
};

/**
 * PUT /api/internships/:id/publish — Admin only
 */
const togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByPk(id);
    if (!internship) {
      return next(new AppError('Internship not found', 404));
    }

    internship.is_published = !internship.is_published;
    internship.published_at = internship.is_published ? new Date() : null;
    internship.updated_by = req.user.id;
    await internship.save();

    res.json({
      success: true,
      message: `Internship ${internship.is_published ? 'published' : 'unpublished'} successfully`,
      data: internship
    });
  } catch (error) {
    next(new AppError('Failed to toggle publish status', 500));
  }
};

/**
 * POST /api/internships/:id/register — Student: register for internship
 */
const registerForInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const internship = await Internship.findByPk(id);
    if (!internship || !internship.is_published) {
      return next(new AppError('Internship not found', 404));
    }
    if (internship.status === 'completed' || internship.status === 'cancelled') {
      return next(new AppError('Registrations are closed for this internship', 400));
    }

    // Check if already registered
    const existing = await InternshipRegistration.findOne({
      where: { internship_id: id, student_id: studentId }
    });
    if (existing) {
      return next(new AppError('You are already registered for this internship', 400));
    }

    // Check capacity
    if (internship.max_registrations && internship.current_registrations >= internship.max_registrations) {
      return next(new AppError('This internship is full', 400));
    }

    const registration = await InternshipRegistration.create({
      internship_id: id,
      student_id: studentId,
      status: 'registered',
      registered_at: new Date()
    });

    // Increment count
    await internship.increment('current_registrations');

    res.status(201).json({
      success: true,
      message: 'Successfully registered for internship',
      data: registration
    });
  } catch (error) {
    console.error('Error registering for internship:', error);
    next(new AppError('Failed to register for internship', 500));
  }
};

/**
 * GET /api/internships/my — Student's own registered internships
 */
const getMyInternships = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const registrations = await InternshipRegistration.findAll({
      where: { student_id: studentId },
      include: [
        { model: Internship, as: 'internship' }
      ],
      order: [['registered_at', 'DESC']]
    });
    res.json({ success: true, data: { registrations } });
  } catch (error) {
    next(new AppError('Failed to fetch your internships', 500));
  }
};

/**
 * GET /api/internships/:id/registrations — Admin: view all registrations for an internship
 */
const getRegistrations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const registrations = await InternshipRegistration.findAll({
      where: { internship_id: id },
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'avatar'] }
      ],
      order: [['registered_at', 'DESC']]
    });
    res.json({ success: true, data: { registrations } });
  } catch (error) {
    next(new AppError('Failed to fetch registrations', 500));
  }
};

/**
 * PUT /api/internships/:id/registrations/:regId — Admin: update registration status (e.g., mark completed)
 */
const updateRegistration = async (req, res, next) => {
  try {
    const { id, regId } = req.params;
    const { status, certificate_url, admin_notes } = req.body;

    const registration = await InternshipRegistration.findOne({
      where: { id: regId, internship_id: id }
    });
    if (!registration) {
      return next(new AppError('Registration not found', 404));
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (certificate_url) updateData.certificate_url = certificate_url;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    if (status === 'completed') updateData.completed_at = new Date();

    await registration.update(updateData);

    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: registration
    });
  } catch (error) {
    next(new AppError('Failed to update registration', 500));
  }
};

module.exports = {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  togglePublish,
  registerForInternship,
  getMyInternships,
  getRegistrations,
  updateRegistration
};

const { Plan, Subscription, PaymentRequest, User, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const notificationService = require('../services/notificationService');
const { Op } = require('sequelize');

/**
 * Get available plans (public)
 */
exports.getPlans = async (req, res, next) => {
    try {
        const plans = await Plan.findAll({
            where: {
                is_active: true,
                name: { [Op.in]: ['free', 'basic', 'pro'] }
            },
            attributes: ['id', 'name', 'description', 'price', 'currency', 'features', 'tier_order'],
            order: [['tier_order', 'ASC']]
        });

        res.json({
            success: true,
            data: plans
        });
    } catch (error) {
        next(new AppError('Failed to fetch plans', 500));
    }
};

/**
 * Student: Submit UPI Transaction ID for a plan
 */
exports.submitPaymentRequest = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { plan_id, transaction_id } = req.body;
        const userId = req.user.id;

        if (!plan_id || !transaction_id) {
            throw new AppError('Plan and Transaction ID are required', 400);
        }

        // Validate transaction ID format
        const trimmedTxn = transaction_id.trim().toUpperCase();
        if (trimmedTxn.length < 8 || trimmedTxn.length > 50) {
            throw new AppError('Invalid Transaction ID. Please enter a valid UPI Transaction ID.', 400);
        }

        // Check plan exists
        const plan = await Plan.findOne({
            where: {
                id: plan_id,
                is_active: true,
                name: { [Op.in]: ['basic', 'pro'] }
            }
        });
        if (!plan) {
            throw new AppError('Invalid plan selected. Only Basic and Pro plans can be purchased.', 400);
        }

        // Check if this transaction ID was already submitted
        const existingTxn = await PaymentRequest.findOne({ where: { transaction_id: trimmedTxn } });
        if (existingTxn) {
            throw new AppError('This Transaction ID has already been submitted. Please contact support if this is an error.', 400);
        }

        // Check if user already has a pending request
        const pendingRequest = await PaymentRequest.findOne({
            where: { user_id: userId, status: 'pending' }
        });
        if (pendingRequest) {
            throw new AppError('You already have a pending payment request. Please wait for admin approval.', 400);
        }

        // Create pending payment request
        const paymentRequest = await PaymentRequest.create({
            user_id: userId,
            plan_id: plan.id,
            transaction_id: trimmedTxn,
            amount: plan.price,
            status: 'pending'
        }, { transaction });

        // OPTIMISTIC ACTIVATION: Automatically activate student's plan
        
        // Cancel any existing active subscriptions
        await Subscription.update(
            { status: 'cancelled', end_date: new Date() },
            {
                where: { user_id: userId, status: 'active' },
                transaction
            }
        );

        // Create new lifetime subscription immediately
        await Subscription.create({
            user_id: userId,
            plan_id: plan.id,
            status: 'active',
            start_date: new Date(),
            end_date: null, // Lifetime access
            payment_id: `UPI_${trimmedTxn}`
        }, { transaction });

        // Update RBAC permissions immediately based on plan
        const StudentPermission = require('../models').StudentPermission;
        const planName = plan.name.toLowerCase();
        const hackathonsAccess = (planName === 'basic' || planName === 'pro');

        const existingPerm = await StudentPermission.findOne({
            where: { student_id: userId },
            transaction
        });

        if (existingPerm) {
            await existingPerm.update({
                courses: true,
                hackathons: hackathonsAccess,
                realtime_projects: true
            }, { transaction });
        } else {
            await StudentPermission.create({
                student_id: userId,
                courses: true,
                hackathons: hackathonsAccess,
                realtime_projects: true
            }, { transaction });
        }

        // Sync User plan_type for fallback legacy checks
        await User.update(
            { plan_type: 'premium' },
            { where: { id: userId }, transaction }
        );

        await transaction.commit();

        try {
            await notificationService.create(
                userId,
                'plan_upgraded',
                'Upgrade Request Submitted',
                `Your payment request for the ${plan.name} plan has been submitted and is pending admin approval.`,
                '/pricing'
            );
        } catch (error) {
            console.error('Failed to notify payment request submission', error);
        }

        res.status(201).json({
            success: true,
            message: 'Payment request submitted! Your account has been upgraded optimistically. Admin will verify the transaction.',
            data: {
                id: paymentRequest.id,
                transaction_id: paymentRequest.transaction_id,
                plan: plan.name,
                amount: plan.price,
                status: 'pending'
            }
        });

    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return next(new AppError('This Transaction ID has already been submitted.', 400));
        }
        next(error);
    }
};

/**
 * Admin: Get all payment requests
 */
exports.getPaymentRequests = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return next(new AppError('Not authorized', 403));
        }

        const { status } = req.query; // optional filter: pending, approved, rejected
        const where = {};
        if (status) where.status = status;

        const requests = await PaymentRequest.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['id', 'name', 'price', 'currency']
                },
                {
                    model: User,
                    as: 'approvedByUser',
                    attributes: ['id', 'name'],
                    required: false
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        next(new AppError('Failed to fetch payment requests', 500));
    }
};

/**
 * Admin: Approve a payment request → create subscription
 */
exports.approvePaymentRequest = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return next(new AppError('Not authorized', 403));
        }

        const { id } = req.params;
        const { admin_notes } = req.body;

        const paymentRequest = await PaymentRequest.findByPk(id, {
            include: [{ model: Plan, as: 'plan' }]
        });

        if (!paymentRequest) {
            throw new AppError('Payment request not found', 404);
        }

        if (paymentRequest.status !== 'pending') {
            throw new AppError(`This request is already ${paymentRequest.status}`, 400);
        }

        // Verify the payment request and add admin notes. 
        // Subscription and permissions were already activated optimistically in submitPaymentRequest.
        await paymentRequest.update({
            status: 'approved',
            admin_notes: admin_notes || null,
            approved_by: req.user.id
        });

        // Notification
        await notificationService.create(
            paymentRequest.user_id,
            'plan_upgraded',
            'Plan Upgraded',
            `Your payment was approved! You are now on the ${paymentRequest.plan.name} plan.`,
            '/profile'
        );

        res.json({
            success: true,
            message: `Payment approved. Transaction verified for ${paymentRequest.plan.name} plan.`
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Reject a payment request
 */
exports.rejectPaymentRequest = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        if (req.user.role !== 'admin') {
            return next(new AppError('Not authorized', 403));
        }

        const { id } = req.params;
        const { admin_notes } = req.body;

        const paymentRequest = await PaymentRequest.findByPk(id, {
            include: [{ model: Plan, as: 'plan' }]
        });

        if (!paymentRequest) {
            throw new AppError('Payment request not found', 404);
        }

        if (paymentRequest.status !== 'pending') {
            throw new AppError(`This request is already ${paymentRequest.status}`, 400);
        }

        // Mark payment as rejected
        await paymentRequest.update({
            status: 'rejected',
            admin_notes: admin_notes || null,
            approved_by: req.user.id
        }, { transaction });

        // Revoke the exact subscription created during optimistic activation
        await Subscription.update(
            { status: 'cancelled', end_date: new Date() },
            {
                where: { 
                    user_id: paymentRequest.user_id, 
                    plan_id: paymentRequest.plan_id,
                    status: 'active' 
                },
                transaction
            }
        );

        // Downgrade permissions back to default 'free' (no hackathons)
        const StudentPermission = require('../models').StudentPermission;
        await StudentPermission.update(
            { hackathons: false },
            { where: { student_id: paymentRequest.user_id }, transaction }
        );

        // Reset User plan_type
        await User.update(
            { plan_type: 'free' },
            { where: { id: paymentRequest.user_id }, transaction }
        );

        await transaction.commit();

        try {
            await notificationService.create(
                paymentRequest.user_id,
                'plan_upgraded',
                'Upgrade Request Rejected',
                `Your payment request for the ${paymentRequest.plan.name} plan was rejected. Notes: ${admin_notes || 'None'}`,
                '/pricing'
            );
        } catch (error) {
            console.error('Failed to notify payment request rejection', error);
        }

        res.json({
            success: true,
            message: 'Payment request rejected. The student\'s premium access has been reliably revoked.'
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

/**
 * Get current user's subscription
 */
exports.getMySubscription = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const subscription = await Subscription.findOne({
            where: {
                user_id: userId,
                status: 'active',
                [Op.or]: [
                    { end_date: null },
                    { end_date: { [Op.gt]: new Date() } }
                ]
            },
            include: [{ model: Plan, as: 'plan' }]
        });

        // Auto-expire if end_date has passed
        if (!subscription) {
            // Check if there's an expired one and mark it
            await Subscription.update(
                { status: 'expired' },
                {
                    where: {
                        user_id: userId,
                        status: 'active',
                        end_date: { [Op.lt]: new Date() }
                    }
                }
            );
        }

        // Also return pending payment request if any
        const pendingRequest = await PaymentRequest.findOne({
            where: { user_id: userId, status: 'pending' },
            include: [{ model: Plan, as: 'plan' }]
        });

        res.json({
            success: true,
            data: subscription,
            pendingRequest: pendingRequest || null
        });
    } catch (error) {
        next(new AppError('Failed to fetch subscription', 500));
    }
};

/**
 * Get subscription statistics (Admin only)
 */
exports.getSubscriptionStats = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return next(new AppError('Not authorized', 403));
        }

        const subscriptions = await Subscription.findAll({
            where: {
                status: 'active',
                [Op.or]: [
                    { end_date: null },
                    { end_date: { [Op.gt]: new Date() } }
                ]
            },
            include: [{ model: Plan, as: 'plan', attributes: ['name'] }]
        });

        const pendingCount = await PaymentRequest.count({ where: { status: 'pending' } });

        const stats = {
            free: 0,
            basic: 0,
            pro: 0,
            total: subscriptions.length,
            pendingPayments: pendingCount
        };

        subscriptions.forEach(sub => {
            const planName = sub.plan?.name?.toLowerCase();
            if (planName === 'free') stats.free++;
            if (planName === 'basic') stats.basic++;
            if (planName === 'pro') stats.pro++;
        });

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(new AppError('Failed to fetch subscription stats', 500));
    }
};

/**
 * Get all subscriptions (Admin only)
 */
exports.getAllSubscriptions = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return next(new AppError('Not authorized', 403));
        }

        const subscriptions = await Subscription.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['name', 'price', 'currency', 'tier_order']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(new AppError('Failed to fetch subscriptions', 500));
    }
};

/**
 * Get package stats (plans distribution + revenue)
 */
exports.getPackageStats = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return next(new AppError('Not authorized', 403));
        }

        const plans = await Plan.findAll({
            where: { is_active: true },
            attributes: ['id', 'name', 'price', 'tier_order'],
            order: [['tier_order', 'ASC']]
        });

        const activeSubs = await Subscription.findAll({
            where: {
                status: 'active',
                [Op.or]: [{ end_date: null }, { end_date: { [Op.gt]: new Date() } }]
            },
            include: [{ model: Plan, as: 'plan', attributes: ['name', 'price', 'tier_order'] }]
        });

        const pendingCount = await PaymentRequest.count({ where: { status: 'pending' } });
        const approvedRequests = await PaymentRequest.findAll({
            where: { status: 'approved' },
            include: [{ model: Plan, as: 'plan', attributes: ['price'] }]
        });

        const totalRevenue = approvedRequests.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);

        const totalStudentsCount = await User.count({ where: { role: 'student' } });
        
        const distribution = { free: 0, basic: 0, pro: 0 };
        activeSubs.forEach(sub => {
            const planName = sub.plan?.name?.toLowerCase();
            if (planName === 'basic' || planName === 'pro') {
                distribution[planName]++;
            }
        });

        // Any student NOT in basic or pro is automatically a free member for stats purposes
        distribution.free = Math.max(0, totalStudentsCount - distribution.basic - distribution.pro);

        res.json({
            success: true,
            data: {
                distribution,
                totalActiveSubscriptions: activeSubs.length,
                pendingPayments: pendingCount,
                totalRevenue
            }
        });
    } catch (error) {
        next(new AppError('Failed to fetch package stats', 500));
    }
};

/**
 * Admin: Manually assign a plan to a student (no payment required)
 */
exports.manualUpgrade = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        if (req.user.role !== 'admin') {
            return next(new AppError('Not authorized', 403));
        }

        const { student_id, plan_name } = req.body;

        if (!student_id || !plan_name) {
            throw new AppError('student_id and plan_name are required', 400);
        }

        const validPlans = ['free', 'basic', 'pro'];
        if (!validPlans.includes(plan_name.toLowerCase())) {
            throw new AppError('Invalid plan_name. Must be free, basic, or pro.', 400);
        }

        const student = await User.findOne({ where: { id: student_id, role: 'student' } });
        if (!student) throw new AppError('Student not found', 404);

        const plan = await Plan.findOne({ where: { name: plan_name.toLowerCase(), is_active: true } });
        if (!plan) throw new AppError('Plan not found', 404);

        // Cancel current subscriptions
        await Subscription.update(
            { status: 'cancelled', end_date: new Date() },
            { where: { user_id: student_id, status: 'active' }, transaction }
        );

        // Create new lifetime subscription
        await Subscription.create({
            user_id: student_id,
            plan_id: plan.id,
            status: 'active',
            start_date: new Date(),
            end_date: null, // lifetime
            payment_id: `MANUAL_ADMIN_${req.user.id}_${Date.now()}`
        }, { transaction });

        // Update RBAC permissions
        const StudentPermission = require('../models').StudentPermission;
        const hackathonsAccess = plan_name !== 'free';
        const [perm] = await StudentPermission.findOrCreate({
            where: { student_id },
            defaults: { student_id, courses: true, hackathons: hackathonsAccess, realtime_projects: true },
            transaction
        });
        await perm.update({ hackathons: hackathonsAccess, courses: true, realtime_projects: true }, { transaction });

        await transaction.commit();

        // Notification
        await notificationService.create(
            student_id,
            'plan_upgraded',
            'Plan Upgraded',
            `An admin has upgraded your account to the ${plan_name} plan.`,
            '/profile'
        );

        res.json({
            success: true,
            message: `Student "${student.name}" has been manually upgraded to the ${plan_name} plan.`
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

const { Plan, Subscription, PaymentRequest, User, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

/**
 * Get available plans (public)
 */
exports.getPlans = async (req, res, next) => {
    try {
        const plans = await Plan.findAll({
            where: { is_active: true },
            attributes: ['id', 'name', 'description', 'price', 'currency', 'features'],
            order: [['price', 'ASC']]
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
    try {
        const { plan_id, transaction_id } = req.body;
        const userId = req.user.id;

        if (!plan_id || !transaction_id) {
            throw new AppError('Plan and Transaction ID are required', 400);
        }

        // Validate transaction ID format (basic check — alphanumeric, 8-30 chars)
        const trimmedTxn = transaction_id.trim().toUpperCase();
        if (trimmedTxn.length < 8 || trimmedTxn.length > 50) {
            throw new AppError('Invalid Transaction ID. Please enter a valid UPI Transaction ID.', 400);
        }

        // Check plan exists
        const plan = await Plan.findOne({ where: { id: plan_id, is_active: true } });
        if (!plan) {
            throw new AppError('Invalid plan selected', 400);
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

        // Check if user already has an active subscription
        const activeSub = await Subscription.findOne({
            where: {
                user_id: userId,
                status: 'active',
                end_date: { [Op.gt]: new Date() }
            }
        });
        if (activeSub) {
            throw new AppError('You already have an active subscription.', 400);
        }

        // Create payment request
        const paymentRequest = await PaymentRequest.create({
            user_id: userId,
            plan_id: plan.id,
            transaction_id: trimmedTxn,
            amount: plan.price,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Payment request submitted successfully! Admin will verify and activate your subscription within 24 hours.',
            data: {
                id: paymentRequest.id,
                transaction_id: paymentRequest.transaction_id,
                plan: plan.name,
                amount: plan.price,
                status: 'pending'
            }
        });

    } catch (error) {
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

        // Calculate subscription end date based on plan
        const startDate = new Date();
        let endDate = new Date();
        const planName = paymentRequest.plan.name.toLowerCase();

        if (planName === 'monthly') {
            endDate.setDate(endDate.getDate() + 30);
        } else if (planName === 'yearly') {
            endDate.setDate(endDate.getDate() + 365);
        } else {
            // Fallback: 30 days
            endDate.setDate(endDate.getDate() + 30);
        }

        // Cancel any existing active subscription for this user
        await Subscription.update(
            { status: 'cancelled', end_date: new Date() },
            {
                where: { user_id: paymentRequest.user_id, status: 'active' },
                transaction
            }
        );

        // Create new active subscription
        await Subscription.create({
            user_id: paymentRequest.user_id,
            plan_id: paymentRequest.plan_id,
            status: 'active',
            start_date: startDate,
            end_date: endDate,
            payment_id: `UPI_${paymentRequest.transaction_id}`
        }, { transaction });

        // Update payment request status
        // Update payment request status
        await paymentRequest.update({
            status: 'approved',
            admin_notes: admin_notes || null,
            approved_by: req.user.id
        }, { transaction });

        // AUTOMATICALLY UPDATE RBAC PERMISSIONS based on plan
        // Basic/Pro -> Grant Hackathons & Realtime Projects access
        // Starter -> Revoke Hackathons (if logic existed), but here we are upgrading
        const StudentPermission = require('../models').StudentPermission;

        let hackathonsAccess = false;
        // Grant hackathons for both Basic and Pro
        if (planName === 'basic' || planName === 'pro') {
            hackathonsAccess = true;
        }

        // Check if permission record exists
        const existingPerm = await StudentPermission.findOne({
            where: { student_id: paymentRequest.user_id },
            transaction
        });

        if (existingPerm) {
            await existingPerm.update({
                courses: true, // Always true
                hackathons: hackathonsAccess,
                realtime_projects: true // Always true (list access, locking handled by content)
            }, { transaction });
        } else {
            await StudentPermission.create({
                student_id: paymentRequest.user_id,
                courses: true,
                hackathons: hackathonsAccess,
                realtime_projects: true
            }, { transaction });
        }

        await transaction.commit();

        res.json({
            success: true,
            message: `Payment approved. ${paymentRequest.plan.name} subscription activated until ${endDate.toLocaleDateString('en-IN')}.`
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

/**
 * Admin: Reject a payment request
 */
exports.rejectPaymentRequest = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return next(new AppError('Not authorized', 403));
        }

        const { id } = req.params;
        const { admin_notes } = req.body;

        const paymentRequest = await PaymentRequest.findByPk(id);

        if (!paymentRequest) {
            throw new AppError('Payment request not found', 404);
        }

        if (paymentRequest.status !== 'pending') {
            throw new AppError(`This request is already ${paymentRequest.status}`, 400);
        }

        await paymentRequest.update({
            status: 'rejected',
            admin_notes: admin_notes || null,
            approved_by: req.user.id
        });

        res.json({
            success: true,
            message: 'Payment request rejected.'
        });

    } catch (error) {
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
            monthly: 0,
            yearly: 0,
            total: subscriptions.length,
            pendingPayments: pendingCount
        };

        subscriptions.forEach(sub => {
            const planName = sub.plan?.name?.toLowerCase();
            if (planName === 'free') stats.free++;
            if (planName === 'monthly') stats.monthly++;
            if (planName === 'yearly') stats.yearly++;
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
                    attributes: ['name', 'price', 'currency']
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

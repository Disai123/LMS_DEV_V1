/**
 * Normalize pricing to exactly three plans: free (0), basic (299), pro (799)
 * Run: node scripts/normalize-plans-three-tier.js
 */
require('dotenv').config();
const { sequelize, Plan, Subscription, PaymentRequest, Course } = require('../models');

const CANONICAL_PLANS = {
  free: {
    description: 'Free access to Python, Machine Learning & Todo App project',
    price: 0.0,
    tier_order: 0,
    features: {
      courses: ['Python for Beginners', 'Machine Learning'],
      projects: ['Todo Application', 'Prerequisites'],
      highlights: ['2 Free Courses', '2 Realtime Projects', 'Community Access']
    }
  },
  basic: {
    description: 'Access to Deep Learning, NLP, GenAI + Ecommerce project',
    price: 299.0,
    tier_order: 1,
    features: {
      courses: ['Python for Beginners', 'Machine Learning', 'Deep Learning', 'NLP', 'GenAI'],
      projects: ['Todo Application', 'Prerequisites', 'Ecommerce Web'],
      highlights: ['5 Courses', '3 Realtime Projects', 'Certificate', 'Priority Support']
    }
  },
  pro: {
    description: 'Full access to all courses and realtime projects',
    price: 799.0,
    tier_order: 2,
    features: {
      courses: ['All Courses'],
      projects: ['All Projects'],
      highlights: ['All Courses', 'All Projects', 'Certificate', 'Priority Support', 'Lifetime Access']
    }
  }
};

const LEGACY_TO_CANONICAL = {
  starter: 'free',
  monthly: 'pro',
  yearly: 'pro'
};

async function getPlanByName(name, transaction) {
  return Plan.findOne({ where: { name }, transaction });
}

async function normalize() {
  await sequelize.authenticate();
  const transaction = await sequelize.transaction();

  try {
    console.log('=== Normalizing plans to free / basic / pro ===\n');

    // 1. Upsert canonical plans
    for (const [name, data] of Object.entries(CANONICAL_PLANS)) {
      let plan = await getPlanByName(name, transaction);
      if (!plan) {
        plan = await Plan.create({
          name,
          currency: 'INR',
          is_active: true,
          ...data
        }, { transaction });
        console.log(`Created plan: ${name}`);
      } else {
        await plan.update({
          description: data.description,
          price: data.price,
          tier_order: data.tier_order,
          features: data.features,
          is_active: true,
          currency: 'INR'
        }, { transaction });
        console.log(`Updated plan: ${name} (₹${data.price})`);
      }
    }

    const canonicalPlans = {};
    for (const name of Object.keys(CANONICAL_PLANS)) {
      canonicalPlans[name] = await getPlanByName(name, transaction);
    }

    // 2. Migrate subscriptions on legacy plans
    const legacyPlans = await Plan.findAll({
      where: { name: ['starter', 'monthly', 'yearly'] },
      transaction
    });

    for (const legacyPlan of legacyPlans) {
      const targetName = LEGACY_TO_CANONICAL[legacyPlan.name] || 'free';
      const targetPlan = canonicalPlans[targetName];
      const subs = await Subscription.findAll({
        where: { plan_id: legacyPlan.id },
        transaction
      });

      for (const sub of subs) {
        await sub.update({ plan_id: targetPlan.id }, { transaction });
        console.log(`Migrated subscription ${sub.id} from ${legacyPlan.name} -> ${targetName}`);
      }

      const requests = await PaymentRequest.findAll({
        where: { plan_id: legacyPlan.id },
        transaction
      });

      for (const req of requests) {
        await req.update({ plan_id: targetPlan.id }, { transaction });
        console.log(`Migrated payment_request ${req.id} from ${legacyPlan.name} -> ${targetName}`);
      }
    }

    // 3. Fix Demo course anomaly
    const demoCourse = await Course.findByPk(7, { transaction });
    if (demoCourse) {
      await demoCourse.update({ required_plan: 'pro', is_free: false }, { transaction });
      console.log('Fixed Demo course: required_plan=pro, is_free=false');
    }

    // 4. Delete legacy plans (must have no remaining FK refs)
    for (const legacyPlan of legacyPlans) {
      const remainingSubs = await Subscription.count({
        where: { plan_id: legacyPlan.id },
        transaction
      });
      const remainingReqs = await PaymentRequest.count({
        where: { plan_id: legacyPlan.id },
        transaction
      });

      if (remainingSubs > 0 || remainingReqs > 0) {
        throw new Error(
          `Cannot delete plan ${legacyPlan.name}: ${remainingSubs} subs, ${remainingReqs} payment requests remain`
        );
      }

      await legacyPlan.destroy({ transaction });
      console.log(`Deleted legacy plan: ${legacyPlan.name} (id ${legacyPlan.id})`);
    }

    await transaction.commit();

    const finalPlans = await Plan.findAll({ order: [['tier_order', 'ASC']] });
    console.log('\n=== Final plans ===');
    finalPlans.forEach(p => {
      console.log(`  ${p.name}: ₹${p.price}, tier ${p.tier_order}, active=${p.is_active}`);
    });
    console.log('\nDone.');
  } catch (err) {
    await transaction.rollback();
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

normalize();

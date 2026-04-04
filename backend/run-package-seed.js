/**
 * Seed Plans and set required_plan on courses/projects
 * Run: node run-package-seed.js
 */
const { sequelize, Plan, Course, Project } = require('./models');

// Package definitions
const PLANS = [
  {
    name: 'free',
    description: 'Free access to Python, Machine Learning & Todo App project',
    price: 0.00,
    currency: 'INR',
    tier_order: 0,
    is_active: true,
    features: {
      courses: ['Python for Beginners', 'Machine Learning'],
      projects: ['Todo Application'],
      highlights: ['2 Free Courses', '1 Realtime Project', 'Community Access']
    }
  },
  {
    name: 'basic',
    description: 'Access to 5 courses including Deep Learning, NLP, GenAI + 3 projects',
    price: 299.00,
    currency: 'INR',
    tier_order: 1,
    is_active: true,
    features: {
      courses: ['Python for Beginners', 'Machine Learning', 'Deep Learning', 'NLP', 'GenAI'],
      projects: ['Todo Application', 'Ecommerce Web'],
      highlights: ['5 Courses', '3 Realtime Projects', 'Certificate', 'Priority Support']
    }
  },
  {
    name: 'pro',
    description: 'Full access to all courses and realtime projects',
    price: 799.00,
    currency: 'INR',
    tier_order: 2,
    is_active: true,
    features: {
      courses: ['All Courses'],
      projects: ['All Projects'],
      highlights: ['All Courses', 'All Projects', 'Certificate', 'Priority Support', 'Lifetime Access']
    }
  }
];

// Course to plan tier mapping (by partial title match)
const COURSE_PLAN_MAP = [
  { keywords: ['python'], plan: 'free' },
  { keywords: ['machine learning'], plan: 'free' },
  { keywords: ['deep learning'], plan: 'basic' },
  { keywords: ['nlp', 'natural language'], plan: 'basic' },
  { keywords: ['genai', 'generative', 'gen ai', 'llm'], plan: 'basic' },
];

// Project to plan tier mapping (by partial title match)
const PROJECT_PLAN_MAP = [
  { keywords: ['todo'], plan: 'free' },
  { keywords: ['ecommerce', 'e-commerce', 'e commerce', 'unicart', 'askunicart', 'ask unicart'], plan: 'basic' },
];

async function getPlanForTitle(title, planMap, allPro = true) {
  const lowerTitle = title.toLowerCase();
  for (const mapping of planMap) {
    if (mapping.keywords.some(kw => lowerTitle.includes(kw))) {
      return mapping.plan;
    }
  }
  // Default: if allPro is true, unmatched items go to 'pro'; else 'free'
  return allPro ? 'pro' : 'free';
}

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected\n');

    // 1. Upsert plans
    console.log('📋 Upserting plans...');
    for (const planData of PLANS) {
      const [plan, created] = await Plan.findOrCreate({
        where: { name: planData.name },
        defaults: planData
      });
      if (!created) {
        await plan.update({
          description: planData.description,
          price: planData.price,
          currency: planData.currency,
          tier_order: planData.tier_order,
          is_active: planData.is_active,
          features: planData.features
        });
        console.log(`  ✓ Updated plan: ${planData.name} (₹${planData.price})`);
      } else {
        console.log(`  ✓ Created plan: ${planData.name} (₹${planData.price})`);
      }
    }

    // 2. Set required_plan on all courses
    console.log('\n📚 Setting required_plan on courses...');
    const courses = await Course.findAll({ attributes: ['id', 'title', 'required_plan'] });
    let courseUpdated = 0;
    for (const course of courses) {
      const requiredPlan = await getPlanForTitle(course.title, COURSE_PLAN_MAP, true);
      if (course.required_plan !== requiredPlan) {
        await course.update({ required_plan: requiredPlan });
        console.log(`  ✓ "${course.title}" → ${requiredPlan}`);
        courseUpdated++;
      } else {
        console.log(`  - "${course.title}" → ${requiredPlan} (already set)`);
      }
    }
    console.log(`  Updated ${courseUpdated}/${courses.length} courses`);

    // 3. Set required_plan on all projects
    console.log('\n🚀 Setting required_plan on projects...');
    const projects = await Project.findAll({ attributes: ['id', 'title', 'required_plan'] });
    let projectUpdated = 0;
    for (const project of projects) {
      const requiredPlan = await getPlanForTitle(project.title, PROJECT_PLAN_MAP, true);
      if (project.required_plan !== requiredPlan) {
        await project.update({ required_plan: requiredPlan });
        console.log(`  ✓ "${project.title}" → ${requiredPlan}`);
        projectUpdated++;
      } else {
        console.log(`  - "${project.title}" → ${requiredPlan} (already set)`);
      }
    }
    console.log(`  Updated ${projectUpdated}/${projects.length} projects`);

    console.log('\n🎉 Package seeding completed successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
  } finally {
    await sequelize.close();
  }
}

seed();

const { sequelize, Plan, Coupon } = require('./models');

async function seedCoupons() {
    try {
        console.log('🔄 Seeding Coupons...');
        await sequelize.authenticate();

        // 1. Find the existing Basic Plan (we saw ID 2 in the check)
        // 1. Find the existing Basic Plan
        // The check-db output showed it as "basic" (lowercase)
        let basicPlan = await Plan.findOne({ where: { name: 'basic' } });

        if (!basicPlan) {
            console.log('ℹ️ Lowercase "basic" not found, trying "Basic"...');
            basicPlan = await Plan.findOne({ where: { name: 'Basic' } });
        }

        if (!basicPlan) {
            console.log('❌ Error: Basic plan not found!');
            // Optional: Create it if really missing, but let's stick to simple fix first
            return;
        }

        // 2. Create Coupon
        const couponCode = 'WELCOME2026';
        const [coupon, created] = await Coupon.findOrCreate({
            where: { code: couponCode },
            defaults: {
                description: 'Welcome discount for new students',
                plan_id: basicPlan.id,
                discount_percentage: 100, // 100% OFF
                max_uses: 1000,
                is_active: true
            }
        });

        if (created) {
            console.log(`✅ Success! Created Coupon: ${couponCode}`);
        } else {
            console.log(`ℹ️ Coupon ${couponCode} already exists.`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

seedCoupons();

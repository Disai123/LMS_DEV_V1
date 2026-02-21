const { sequelize, Plan, Coupon } = require('./models');

async function checkData() {
    try {
        console.log('🔄 Checking Database Data...');
        await sequelize.authenticate();

        const plans = await Plan.findAll();
        console.log(`\n📋 Plans found: ${plans.length}`);
        plans.forEach(p => console.log(` - [${p.id}] ${p.name} ($${p.price})`));

        const coupons = await Coupon.findAll();
        console.log(`\n🎟️ Coupons found: ${coupons.length}`);
        coupons.forEach(c => console.log(` - Code: ${c.code} (Plan ID: ${c.plan_id})`));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkData();

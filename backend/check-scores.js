const { sequelize } = require('./models');

async function checkScores() {
    const [users] = await sequelize.query("SELECT id FROM users WHERE email = 'balaji@gmail.com'");
    const studentId = users[0].id;

    const [scores] = await sequelize.query(`SELECT * FROM student_scores WHERE student_id = ${studentId}`);
    const [achievements] = await sequelize.query(`SELECT * FROM student_achievements WHERE student_id = ${studentId}`);

    console.log('\n📊 Student Scores:');
    console.log(JSON.stringify(scores[0], null, 2));

    console.log('\n🏆 Achievements:');
    console.log(JSON.stringify(achievements, null, 2));

    process.exit(0);
}

checkScores().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

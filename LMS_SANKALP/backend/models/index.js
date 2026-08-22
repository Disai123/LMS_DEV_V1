const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: dbConfig.logging,
  pool: dbConfig.pool,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  }
});

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Course = require('./Course')(sequelize, Sequelize.DataTypes);
const Enrollment = require('./Enrollment')(sequelize, Sequelize.DataTypes);
const FileUpload = require('./FileUpload')(sequelize, Sequelize.DataTypes);
const CourseChapter = require('./CourseChapter')(sequelize, Sequelize.DataTypes);
const ChapterProgress = require('./ChapterProgress')(sequelize, Sequelize.DataTypes);
const CourseTest = require('./CourseTest')(sequelize, Sequelize.DataTypes);
const TestQuestion = require('./TestQuestion')(sequelize, Sequelize.DataTypes);
const TestQuestionOption = require('./TestQuestionOption')(sequelize, Sequelize.DataTypes);
const TestAttempt = require('./TestAttempt')(sequelize, Sequelize.DataTypes);
const TestAnswer = require('./TestAnswer')(sequelize, Sequelize.DataTypes);
const Certificate = require('./Certificate')(sequelize, Sequelize.DataTypes);
const ActivityLog = require('./ActivityLog')(sequelize, Sequelize.DataTypes);
const Achievement = require('./Achievement')(sequelize, Sequelize.DataTypes);
const Notification = require('./Notification')(sequelize, Sequelize.DataTypes);

const defineAssociations = () => {
  User.hasMany(Course, {
    foreignKey: 'instructor_id',
    as: 'courses',
    onDelete: 'CASCADE'
  });

  User.belongsToMany(Course, {
    through: Enrollment,
    foreignKey: 'student_id',
    otherKey: 'course_id',
    as: 'enrolledCourses'
  });

  Course.belongsTo(User, {
    foreignKey: 'instructor_id',
    as: 'instructor'
  });

  Course.belongsToMany(User, {
    through: Enrollment,
    foreignKey: 'course_id',
    otherKey: 'student_id',
    as: 'students'
  });

  Course.hasMany(FileUpload, {
    foreignKey: 'course_id',
    as: 'files',
    onDelete: 'CASCADE'
  });

  Course.hasMany(CourseChapter, {
    foreignKey: 'course_id',
    as: 'chapters',
    onDelete: 'CASCADE'
  });

  Course.hasMany(Enrollment, {
    foreignKey: 'course_id',
    as: 'enrollments',
    onDelete: 'CASCADE'
  });

  Enrollment.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  Enrollment.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
  });

  FileUpload.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
  });

  CourseChapter.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
  });

  CourseChapter.belongsTo(CourseTest, {
    foreignKey: 'test_id',
    as: 'test'
  });

  CourseChapter.hasMany(ChapterProgress, {
    foreignKey: 'chapter_id',
    as: 'progress',
    onDelete: 'CASCADE'
  });

  ChapterProgress.belongsTo(Enrollment, {
    foreignKey: 'enrollment_id',
    as: 'enrollment'
  });

  ChapterProgress.belongsTo(CourseChapter, {
    foreignKey: 'chapter_id',
    as: 'chapter'
  });

  Enrollment.hasMany(ChapterProgress, {
    foreignKey: 'enrollment_id',
    as: 'chapterProgress',
    onDelete: 'CASCADE'
  });

  Course.hasMany(CourseTest, {
    foreignKey: 'course_id',
    as: 'tests',
    onDelete: 'CASCADE'
  });

  CourseTest.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
  });

  CourseTest.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'creator'
  });

  CourseTest.hasMany(TestQuestion, {
    foreignKey: 'test_id',
    as: 'questions',
    onDelete: 'CASCADE'
  });

  TestQuestion.belongsTo(CourseTest, {
    foreignKey: 'test_id',
    as: 'test'
  });

  TestQuestion.hasMany(TestQuestionOption, {
    foreignKey: 'question_id',
    as: 'options',
    onDelete: 'CASCADE'
  });

  TestQuestionOption.belongsTo(TestQuestion, {
    foreignKey: 'question_id',
    as: 'question'
  });

  CourseTest.hasMany(TestAttempt, {
    foreignKey: 'test_id',
    as: 'attempts',
    onDelete: 'CASCADE'
  });

  TestAttempt.belongsTo(CourseTest, {
    foreignKey: 'test_id',
    as: 'test'
  });

  TestAttempt.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  TestAttempt.hasMany(TestAnswer, {
    foreignKey: 'attempt_id',
    as: 'answers',
    onDelete: 'CASCADE'
  });

  TestAnswer.belongsTo(TestAttempt, {
    foreignKey: 'attempt_id',
    as: 'attempt'
  });

  TestAnswer.belongsTo(TestQuestion, {
    foreignKey: 'question_id',
    as: 'question'
  });

  User.hasMany(Certificate, {
    foreignKey: 'student_id',
    as: 'certificates',
    onDelete: 'CASCADE'
  });

  Certificate.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  Certificate.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
  });

  Certificate.belongsTo(TestAttempt, {
    foreignKey: 'test_attempt_id',
    as: 'testAttempt'
  });

  User.hasMany(ActivityLog, {
    foreignKey: 'student_id',
    as: 'activities',
    onDelete: 'CASCADE'
  });

  ActivityLog.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  ActivityLog.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
  });

  ActivityLog.belongsTo(CourseChapter, {
    foreignKey: 'chapter_id',
    as: 'chapter'
  });

  ActivityLog.belongsTo(CourseTest, {
    foreignKey: 'test_id',
    as: 'test'
  });

  User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'notifications',
    onDelete: 'CASCADE'
  });

  Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  User.hasMany(Achievement, {
    foreignKey: 'student_id',
    as: 'achievements',
    onDelete: 'CASCADE'
  });

  Achievement.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  Achievement.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
  });
};

defineAssociations();

module.exports = {
  sequelize,
  Sequelize,
  User,
  Course,
  Enrollment,
  FileUpload,
  CourseChapter,
  ChapterProgress,
  CourseTest,
  TestQuestion,
  TestQuestionOption,
  TestAttempt,
  TestAnswer,
  Certificate,
  ActivityLog,
  Achievement,
  Notification
};

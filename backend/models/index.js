const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {},
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true
    },
    quoteIdentifiers: false
  }
);

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Course = require('./Course')(sequelize, Sequelize.DataTypes);
const Enrollment = require('./Enrollment')(sequelize, Sequelize.DataTypes);
const FileUpload = require('./FileUpload')(sequelize, Sequelize.DataTypes);
const CourseChapter = require('./CourseChapter')(sequelize, Sequelize.DataTypes);
const ChapterProgress = require('./ChapterProgress')(sequelize, Sequelize.DataTypes);
const Project = require('./Project')(sequelize, Sequelize.DataTypes);
const Document = require('./Document')(sequelize, Sequelize.DataTypes);
const Video = require('./Video')(sequelize, Sequelize.DataTypes);
const ProjectPhase = require('./ProjectPhase')(sequelize, Sequelize.DataTypes);
const ProjectProgress = require('./ProjectProgress')(sequelize, Sequelize.DataTypes);
const CourseTest = require('./CourseTest')(sequelize, Sequelize.DataTypes);
const TestQuestion = require('./TestQuestion')(sequelize, Sequelize.DataTypes);
const TestQuestionOption = require('./TestQuestionOption')(sequelize, Sequelize.DataTypes);
const TestAttempt = require('./TestAttempt')(sequelize, Sequelize.DataTypes);
const TestAnswer = require('./TestAnswer')(sequelize, Sequelize.DataTypes);
const Certificate = require('./Certificate')(sequelize, Sequelize.DataTypes);
const ActivityLog = require('./ActivityLog')(sequelize, Sequelize.DataTypes);
const Achievement = require('./Achievement')(sequelize, Sequelize.DataTypes);
const Hackathon = require('./Hackathon')(sequelize, Sequelize.DataTypes);
const HackathonParticipant = require('./HackathonParticipant')(sequelize, Sequelize.DataTypes);
const HackathonSubmission = require('./HackathonSubmission')(sequelize, Sequelize.DataTypes);
const HackathonGroup = require('./HackathonGroup')(sequelize, Sequelize.DataTypes);
const HackathonGroupMember = require('./HackathonGroupMember')(sequelize, Sequelize.DataTypes);
const HackathonJoinRequest = require('./HackathonJoinRequest')(sequelize, Sequelize.DataTypes);
const Group = require('./Group')(sequelize, Sequelize.DataTypes);
const GroupMember = require('./GroupMember')(sequelize, Sequelize.DataTypes);
const ChatMessage = require('./ChatMessage')(sequelize, Sequelize.DataTypes);
const ChatParticipant = require('./ChatParticipant')(sequelize, Sequelize.DataTypes);
const StudentPermission = require('./StudentPermission')(sequelize, Sequelize.DataTypes);
const StudentAchievement = require('./StudentAchievement')(sequelize, Sequelize.DataTypes);
const StudentScore = require('./StudentScore')(sequelize, Sequelize.DataTypes);
const ScoringRule = require('./ScoringRule')(sequelize, Sequelize.DataTypes);
const RealtimeProjectSubmission = require('./RealtimeProjectSubmission')(sequelize, Sequelize.DataTypes);
const Plan = require('./Plan')(sequelize, Sequelize.DataTypes);
const Subscription = require('./Subscription')(sequelize, Sequelize.DataTypes);
const Coupon = require('./Coupon')(sequelize, Sequelize.DataTypes);
const PaymentRequest = require('./PaymentRequest')(sequelize, Sequelize.DataTypes);
const ContactMessage = require('./ContactMessage')(sequelize, Sequelize.DataTypes);
const Internship = require('./Internship')(sequelize, Sequelize.DataTypes);
const InternshipRegistration = require('./InternshipRegistration')(sequelize, Sequelize.DataTypes);
const InternshipSubmission = require('./InternshipSubmission')(sequelize, Sequelize.DataTypes);
const Notification = require('./Notification')(sequelize, Sequelize.DataTypes);

// Define associations
const defineAssociations = () => {
  // User associations
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

  // Course associations
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

  // Enrollment associations
  Enrollment.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  Enrollment.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
  });

  // FileUpload associations
  FileUpload.belongsTo(Course, {
    foreignKey: 'course_id',
    as: 'course'
  });

  // CourseChapter associations
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

  // ChapterProgress associations
  ChapterProgress.belongsTo(Enrollment, {
    foreignKey: 'enrollment_id',
    as: 'enrollment'
  });

  ChapterProgress.belongsTo(CourseChapter, {
    foreignKey: 'chapter_id',
    as: 'chapter'
  });

  // Enrollment has many ChapterProgress
  Enrollment.hasMany(ChapterProgress, {
    foreignKey: 'enrollment_id',
    as: 'chapterProgress',
    onDelete: 'CASCADE'
  });

  // Project associations
  Project.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'creator'
  });

  Project.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'updater'
  });

  Project.hasMany(ProjectPhase, {
    foreignKey: 'projectId',
    as: 'projectPhases',
    onDelete: 'CASCADE'
  });

  Project.hasMany(ProjectProgress, {
    foreignKey: 'project_id',
    as: 'progress',
    onDelete: 'CASCADE'
  });

  Project.hasMany(Document, {
    foreignKey: 'project_id',
    as: 'documents',
    onDelete: 'CASCADE'
  });

  Project.hasMany(Video, {
    foreignKey: 'project_id',
    as: 'videos',
    onDelete: 'CASCADE'
  });

  // Document associations
  Document.belongsTo(Project, {
    foreignKey: 'project_id',
    as: 'project'
  });

  Document.belongsTo(User, {
    foreignKey: 'uploaded_by',
    as: 'uploader'
  });

  Document.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'updater'
  });

  // Video associations
  Video.belongsTo(Project, {
    foreignKey: 'project_id',
    as: 'project'
  });

  Video.belongsTo(User, {
    foreignKey: 'uploaded_by',
    as: 'uploader'
  });

  Video.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'updater'
  });

  // ProjectPhase associations
  ProjectPhase.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });

  ProjectPhase.hasMany(ProjectProgress, {
    foreignKey: 'phase_id',
    as: 'progress',
    onDelete: 'CASCADE'
  });

  // ProjectProgress associations
  ProjectProgress.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  ProjectProgress.belongsTo(Project, {
    foreignKey: 'project_id',
    as: 'project'
  });

  ProjectProgress.belongsTo(ProjectPhase, {
    foreignKey: 'phase_id',
    as: 'phase'
  });

  ProjectProgress.belongsTo(User, {
    foreignKey: 'approved_by',
    as: 'approvedBy'
  });

  // User has many ProjectProgress
  User.hasMany(ProjectProgress, {
    foreignKey: 'user_id',
    as: 'projectProgress',
    onDelete: 'CASCADE'
  });

  // Test system associations
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

  Certificate.belongsTo(RealtimeProjectSubmission, {
    foreignKey: 'realtime_project_submission_id',
    as: 'realtimeProjectSubmission'
  });

  RealtimeProjectSubmission.hasOne(Certificate, {
    foreignKey: 'realtime_project_submission_id',
    as: 'certificate'
  });

  // ActivityLog associations
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

  // Notification associations
  User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'notifications',
    onDelete: 'CASCADE'
  });

  Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Achievement associations
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

  // Hackathon associations
  Hackathon.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'creator'
  });

  Hackathon.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'updater'
  });

  Hackathon.belongsTo(User, {
    foreignKey: 'multimedia_uploaded_by',
    as: 'multimediaUploader'
  });

  Hackathon.belongsToMany(User, {
    through: HackathonParticipant,
    foreignKey: 'hackathon_id',
    otherKey: 'student_id',
    as: 'participants'
  });

  // HackathonParticipant associations
  HackathonParticipant.belongsTo(Hackathon, {
    foreignKey: 'hackathon_id',
    as: 'hackathon'
  });

  HackathonParticipant.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  User.belongsToMany(Hackathon, {
    through: HackathonParticipant,
    foreignKey: 'student_id',
    otherKey: 'hackathon_id',
    as: 'hackathons'
  });

  // HackathonSubmission associations
  HackathonSubmission.belongsTo(Hackathon, {
    foreignKey: 'hackathon_id',
    as: 'hackathon'
  });

  HackathonSubmission.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  HackathonSubmission.belongsTo(User, {
    foreignKey: 'reviewed_by',
    as: 'reviewer'
  });

  // Reverse associations
  Hackathon.hasMany(HackathonSubmission, {
    foreignKey: 'hackathon_id',
    as: 'submissions',
    onDelete: 'CASCADE'
  });

  User.hasMany(HackathonSubmission, {
    foreignKey: 'student_id',
    as: 'hackathonSubmissions',
    onDelete: 'CASCADE'
  });

  // HackathonGroup associations
  HackathonGroup.belongsTo(Hackathon, {
    foreignKey: 'hackathon_id',
    as: 'hackathon'
  });

  // HackathonGroup.belongsTo(Group, {
  //   foreignKey: 'group_id',
  //   as: 'standaloneGroup'
  // });

  HackathonGroup.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'creator'
  });

  HackathonGroup.belongsToMany(User, {
    through: HackathonGroupMember,
    foreignKey: 'group_id',
    otherKey: 'student_id',
    as: 'members'
  });

  HackathonGroup.hasMany(HackathonGroupMember, {
    foreignKey: 'group_id',
    as: 'groupMembers'
  });

  // HackathonGroupMember associations
  HackathonGroupMember.belongsTo(HackathonGroup, {
    foreignKey: 'group_id',
    as: 'group'
  });

  HackathonGroupMember.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  HackathonGroupMember.belongsTo(User, {
    foreignKey: 'added_by',
    as: 'addedBy'
  });

  // User associations for groups
  User.belongsToMany(HackathonGroup, {
    through: HackathonGroupMember,
    foreignKey: 'student_id',
    otherKey: 'group_id',
    as: 'hackathonGroups'
  });

  // Hackathon associations for groups
  Hackathon.hasMany(HackathonGroup, {
    foreignKey: 'hackathon_id',
    as: 'groups',
    onDelete: 'CASCADE'
  });

  // Group associations
  Group.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'creator'
  });

  Group.belongsToMany(User, {
    through: GroupMember,
    foreignKey: 'group_id',
    otherKey: 'student_id',
    as: 'members'
  });

  // Group.hasMany(HackathonGroup, {
  //   foreignKey: 'group_id',
  //   as: 'hackathonGroups'
  // });

  Group.hasMany(GroupMember, {
    foreignKey: 'group_id',
    as: 'groupMembers',
    onDelete: 'CASCADE'
  });


  // GroupMember associations
  GroupMember.belongsTo(Group, {
    foreignKey: 'group_id',
    as: 'group'
  });

  GroupMember.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  GroupMember.belongsTo(User, {
    foreignKey: 'added_by',
    as: 'addedBy'
  });

  // User associations for standalone groups
  User.belongsToMany(Group, {
    through: GroupMember,
    foreignKey: 'student_id',
    otherKey: 'group_id',
    as: 'groups'
  });

  User.hasMany(Group, {
    foreignKey: 'created_by',
    as: 'createdGroups',
    onDelete: 'CASCADE'
  });

  // Chat Message associations
  ChatMessage.belongsTo(Hackathon, {
    foreignKey: 'hackathon_id',
    as: 'hackathon'
  });
  ChatMessage.belongsTo(HackathonGroup, {
    foreignKey: 'group_id',
    as: 'group'
  });
  ChatMessage.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  ChatMessage.belongsTo(User, {
    foreignKey: 'deleted_by',
    as: 'deletedBy'
  });
  ChatMessage.belongsTo(ChatMessage, {
    foreignKey: 'reply_to_message_id',
    as: 'replyToMessage'
  });
  ChatMessage.hasMany(ChatMessage, {
    foreignKey: 'reply_to_message_id',
    as: 'replies'
  });

  // Chat Participant associations
  ChatParticipant.belongsTo(Hackathon, {
    foreignKey: 'hackathon_id',
    as: 'hackathon'
  });
  ChatParticipant.belongsTo(HackathonGroup, {
    foreignKey: 'group_id',
    as: 'group'
  });
  ChatParticipant.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // User associations for chat
  User.hasMany(ChatMessage, {
    foreignKey: 'user_id',
    as: 'chatMessages',
    onDelete: 'CASCADE'
  });
  User.hasMany(ChatParticipant, {
    foreignKey: 'user_id',
    as: 'chatParticipants',
    onDelete: 'CASCADE'
  });

  // Hackathon associations for chat
  Hackathon.hasMany(ChatMessage, {
    foreignKey: 'hackathon_id',
    as: 'chatMessages',
    onDelete: 'CASCADE'
  });
  Hackathon.hasMany(ChatParticipant, {
    foreignKey: 'hackathon_id',
    as: 'chatParticipants',
    onDelete: 'CASCADE'
  });

  // HackathonGroup associations for chat
  HackathonGroup.hasMany(ChatMessage, {
    foreignKey: 'group_id',
    as: 'chatMessages',
    onDelete: 'CASCADE'
  });
  HackathonGroup.hasMany(ChatParticipant, {
    foreignKey: 'group_id',
    as: 'chatParticipants',
    onDelete: 'CASCADE'
  });

  // StudentPermission associations
  StudentPermission.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student',
    onDelete: 'CASCADE'
  });

  User.hasOne(StudentPermission, {
    foreignKey: 'student_id',
    as: 'permissions',
    onDelete: 'CASCADE'
  });

  // HackathonJoinRequest associations
  HackathonJoinRequest.belongsTo(Hackathon, {
    foreignKey: 'hackathon_id',
    as: 'hackathon',
    onDelete: 'CASCADE'
  });

  HackathonJoinRequest.belongsTo(User, {
    foreignKey: 'reviewed_by',
    as: 'reviewer',
    onDelete: 'SET NULL'
  });

  // Reverse associations
  Hackathon.hasMany(HackathonJoinRequest, {
    foreignKey: 'hackathon_id',
    as: 'joinRequests',
    onDelete: 'CASCADE'
  });

  User.hasMany(HackathonJoinRequest, {
    foreignKey: 'reviewed_by',
    as: 'reviewedJoinRequests',
    onDelete: 'SET NULL'
  });

  // StudentAchievement associations
  User.hasMany(StudentAchievement, {
    foreignKey: 'student_id',
    as: 'studentAchievements',
    onDelete: 'CASCADE'
  });

  StudentAchievement.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  StudentAchievement.belongsTo(User, {
    foreignKey: 'awarded_by',
    as: 'awardedBy'
  });

  // StudentScore associations
  User.hasOne(StudentScore, {
    foreignKey: 'student_id',
    as: 'studentScore',
    onDelete: 'CASCADE'
  });

  StudentScore.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student'
  });

  // RealtimeProjectSubmission associations
  RealtimeProjectSubmission.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student',
    onDelete: 'CASCADE'
  });

  RealtimeProjectSubmission.belongsTo(User, {
    foreignKey: 'reviewed_by',
    as: 'reviewer',
    onDelete: 'SET NULL'
  });

  User.hasMany(RealtimeProjectSubmission, {
    foreignKey: 'student_id',
    as: 'realtimeProjectSubmissions',
    onDelete: 'CASCADE'
  });


  // Plan associations
  Plan.hasMany(Subscription, {
    foreignKey: 'plan_id',
    as: 'subscriptions'
  });
  Plan.hasMany(Coupon, {
    foreignKey: 'plan_id',
    as: 'coupons'
  });

  // Subscription associations
  Subscription.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  Subscription.belongsTo(Plan, {
    foreignKey: 'plan_id',
    as: 'plan'
  });

  User.hasMany(Subscription, {
    foreignKey: 'user_id',
    as: 'subscriptions'
  });

  User.hasOne(Subscription, {
    foreignKey: 'user_id',
    as: 'activeSubscription',
    scope: {
      status: 'active'
    }
  });

  // InternshipSubmission associations
  InternshipSubmission.belongsTo(User, {
    foreignKey: 'student_id',
    as: 'student',
    onDelete: 'CASCADE'
  });

  InternshipSubmission.belongsTo(Internship, {
    foreignKey: 'internship_id',
    as: 'internship',
    onDelete: 'CASCADE'
  });

  InternshipSubmission.belongsTo(User, {
    foreignKey: 'reviewed_by',
    as: 'reviewer',
    onDelete: 'SET NULL'
  });

  User.hasMany(InternshipSubmission, {
    foreignKey: 'student_id',
    as: 'internshipSubmissions',
    onDelete: 'CASCADE'
  });

  Internship.hasMany(InternshipSubmission, {
    foreignKey: 'internship_id',
    as: 'submissions',
    onDelete: 'CASCADE'
  });

  // Coupon associations
  Coupon.belongsTo(Plan, {
    foreignKey: 'plan_id',
    as: 'plan'
  });

  // PaymentRequest associations
  PaymentRequest.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  PaymentRequest.belongsTo(Plan, {
    foreignKey: 'plan_id',
    as: 'plan'
  });
  PaymentRequest.belongsTo(User, {
    foreignKey: 'approved_by',
    as: 'approvedByUser'
  });
  User.hasMany(PaymentRequest, {
    foreignKey: 'user_id',
    as: 'paymentRequests',
    onDelete: 'CASCADE'
  });
  Plan.hasMany(PaymentRequest, {
    foreignKey: 'plan_id',
    as: 'paymentRequests'
  });

  // Internship associations
  Internship.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  Internship.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
  Internship.hasMany(InternshipRegistration, { foreignKey: 'internship_id', as: 'registrations', onDelete: 'CASCADE' });
  Internship.belongsToMany(User, { through: InternshipRegistration, foreignKey: 'internship_id', otherKey: 'student_id', as: 'registeredStudents' });

  InternshipRegistration.belongsTo(Internship, { foreignKey: 'internship_id', as: 'internship' });
  InternshipRegistration.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

  User.hasMany(InternshipRegistration, { foreignKey: 'student_id', as: 'internshipRegistrations', onDelete: 'CASCADE' });
  User.belongsToMany(Internship, { through: InternshipRegistration, foreignKey: 'student_id', otherKey: 'internship_id', as: 'internships' });

};

// Define associations
defineAssociations();

// Export models and sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  User,
  Course,
  Enrollment,
  FileUpload,
  CourseChapter,
  ChapterProgress,
  Project,
  Document,
  Video,
  ProjectPhase,
  ProjectProgress,
  CourseTest,
  TestQuestion,
  TestQuestionOption,
  TestAttempt,
  TestAnswer,
  Certificate,
  ActivityLog,
  Achievement,
  Hackathon,
  HackathonParticipant,
  HackathonSubmission,
  HackathonGroup,
  HackathonGroupMember,
  HackathonJoinRequest,
  Group,
  GroupMember,
  ChatMessage,
  ChatParticipant,
  StudentPermission,
  StudentAchievement,
  StudentScore,
  ScoringRule,
  RealtimeProjectSubmission,
  Plan,
  Subscription,
  Coupon,
  PaymentRequest,
  ContactMessage,
  Internship,
  InternshipRegistration,
  InternshipSubmission,
  Notification
};

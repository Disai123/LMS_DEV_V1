const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const StudentAchievement = sequelize.define('StudentAchievement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    achievement_type: {
      type: DataTypes.ENUM('course_completion', 'project_approval', 'hackathon_approval', 'master_certificate'),
      allowNull: false
    },
    source_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'course_id, project_id, or hackathon_id'
    },
    source_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'course, project, hackathon, or master_certificate'
    },
    points_awarded: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    awarded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    awarded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Admin who approved (for projects/hackathons)'
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Stores additional info (course name, project name, etc.)'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Can be revoked if needed'
    }
  }, {
    tableName: 'student_achievements',
    indexes: [
      {
        fields: ['student_id']
      },
      {
        fields: ['achievement_type']
      },
      {
        fields: ['source_id']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['awarded_at']
      },
      {
        unique: true,
        fields: ['student_id', 'achievement_type', 'source_id'],
        name: 'unique_student_achievement'
      }
    ]
  });

  // Instance methods
  StudentAchievement.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Class methods
  StudentAchievement.findByStudent = function(studentId, options = {}) {
    return this.findAll({
      where: {
        student_id: studentId,
        is_active: true,
        ...options.where
      },
      order: [['awarded_at', 'DESC']],
      ...options
    });
  };

  StudentAchievement.findByType = function(studentId, achievementType) {
    return this.findAll({
      where: {
        student_id: studentId,
        achievement_type: achievementType,
        is_active: true
      },
      order: [['awarded_at', 'DESC']]
    });
  };

  StudentAchievement.checkExists = function(studentId, achievementType, sourceId) {
    return this.findOne({
      where: {
        student_id: studentId,
        achievement_type: achievementType,
        source_id: sourceId,
        is_active: true
      }
    });
  };

  return StudentAchievement;
};


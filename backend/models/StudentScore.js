const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const StudentScore = sequelize.define('StudentScore', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    total_course_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Aggregated from student_achievements'
    },
    total_project_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Aggregated from student_achievements'
    },
    total_hackathon_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Aggregated from student_achievements'
    },
    total_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Sum of course + project + hackathon points'
    },
    courses_completed_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    projects_approved_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    hackathons_approved_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    master_certificate_issued: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    master_certificate_issued_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    master_certificate_eligibility_checked_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_calculated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'For optimistic locking'
    }
  }, {
    tableName: 'student_scores',
    indexes: [
      {
        unique: true,
        fields: ['student_id']
      },
      {
        fields: ['total_points']
      }
    ],
    hooks: {
      beforeUpdate: (score) => {
        // Calculate total_points automatically
        score.total_points = (score.total_course_points || 0) + 
                            (score.total_project_points || 0) + 
                            (score.total_hackathon_points || 0);
        score.last_calculated_at = new Date();
      }
    }
  });

  // Instance methods
  StudentScore.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  StudentScore.prototype.getPublicInfo = function() {
    return {
      student_id: this.student_id,
      total_course_points: this.total_course_points,
      total_project_points: this.total_project_points,
      total_hackathon_points: this.total_hackathon_points,
      total_points: this.total_points,
      courses_completed_count: this.courses_completed_count,
      projects_approved_count: this.projects_approved_count,
      hackathons_approved_count: this.hackathons_approved_count,
      master_certificate_issued: this.master_certificate_issued,
      master_certificate_issued_at: this.master_certificate_issued_at,
      last_calculated_at: this.last_calculated_at
    };
  };

  // Class methods
  StudentScore.findByStudent = function(studentId) {
    return this.findOne({
      where: { student_id: studentId }
    });
  };

  StudentScore.getOrCreate = async function(studentId) {
    let score = await this.findOne({
      where: { student_id: studentId }
    });

    if (!score) {
      score = await this.create({
        student_id: studentId,
        total_course_points: 0,
        total_project_points: 0,
        total_hackathon_points: 0,
        total_points: 0,
        courses_completed_count: 0,
        projects_approved_count: 0,
        hackathons_approved_count: 0
      });
    }

    return score;
  };

  return StudentScore;
};


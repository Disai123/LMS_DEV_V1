module.exports = (sequelize, DataTypes) => {
  const ChapterProgress = sequelize.define('ChapterProgress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    enrollment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'enrollments',
        key: 'id'
      }
    },
    chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'course_chapters',
        key: 'id'
      }
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    video_watched: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    pdf_viewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    time_spent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Time spent in minutes'
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'chapter_progress',
    timestamps: true,
    underscored: false,
    indexes: [
      {
        unique: true,
        fields: ['enrollment_id', 'chapter_id']
      }
    ]
  });

  // Instance methods
  ChapterProgress.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  ChapterProgress.prototype.markAsCompleted = function() {
    this.is_completed = true;
    this.completed_at = new Date();
    return this.save();
  };

  ChapterProgress.prototype.markVideoWatched = function() {
    this.video_watched = true;
    return this.save();
  };

  ChapterProgress.prototype.markPDFViewed = function() {
    this.pdf_viewed = true;
    return this.save();
  };

  ChapterProgress.prototype.addTimeSpent = function(minutes) {
    this.time_spent += minutes;
    return this.save();
  };

  // Class methods
  ChapterProgress.findByEnrollment = function(enrollmentId) {
    return this.findAll({
      where: { enrollment_id: enrollmentId },
      order: [['created_at', 'ASC']]
    });
  };

  ChapterProgress.findByChapter = function(chapterId) {
    return this.findAll({
      where: { chapter_id: chapterId }
    });
  };

  ChapterProgress.findCompleted = function(enrollmentId) {
    return this.findAll({
      where: { 
        enrollment_id: enrollmentId,
        is_completed: true
      }
    });
  };

  ChapterProgress.getProgressStats = function(enrollmentId) {
    return this.findAll({
      where: { enrollment_id: enrollmentId },
      attributes: [
        'is_completed',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('time_spent')), 'total_time']
      ],
      group: ['is_completed']
    });
  };

  return ChapterProgress;
};

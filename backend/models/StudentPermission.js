const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const StudentPermission = sequelize.define('StudentPermission', {
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
      validate: {
        async isStudent(value) {
          const user = await sequelize.models.User.findByPk(value);
          if (!user || user.role !== 'student') {
            throw new Error('Student ID must reference a valid student user');
          }
        }
      }
    },
    courses: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Access to courses - enabled by default for all students'
    },
    hackathons: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Access to hackathons - enabled by default for all students'
    },
    realtime_projects: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Access to realtime projects - enabled by default for all students'
    }
  }, {
    tableName: 'student_permissions',
    indexes: [
      {
        unique: true,
        fields: ['student_id']
      },
      {
        fields: ['courses']
      },
      {
        fields: ['hackathons']
      },
      {
        fields: ['realtime_projects']
      }
    ],
    hooks: {
      beforeCreate: (permission) => {
        // Ensure courses is always true by default
        if (permission.courses === undefined || permission.courses === null) {
          permission.courses = true;
        }

        // Ensure hackathons and realtime_projects are true by default
        if (permission.hackathons === undefined || permission.hackathons === null) {
          permission.hackathons = true;
        }

        if (permission.realtime_projects === undefined || permission.realtime_projects === null) {
          permission.realtime_projects = true;
        }
      }
    }
  });

  // Define associations
  StudentPermission.associate = (models) => {
    // Belongs to User (student)
    StudentPermission.belongsTo(models.User, {
      foreignKey: 'student_id',
      as: 'student',
      onDelete: 'CASCADE'
    });
  };

  return StudentPermission;
};

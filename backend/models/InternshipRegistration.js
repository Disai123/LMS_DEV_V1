const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const InternshipRegistration = sequelize.define('InternshipRegistration', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    internship_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'internships',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    // Status: registered -> in_progress -> completed
    status: {
      type: DataTypes.ENUM('registered', 'in_progress', 'completed', 'dropped'),
      allowNull: false,
      defaultValue: 'registered'
    },
    registered_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Certificate URL after completion
    certificate_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Admin notes / feedback
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'internship_registrations',
    timestamps: true,
    indexes: [
      { fields: ['internship_id'] },
      { fields: ['student_id'] },
      {
        unique: true,
        fields: ['internship_id', 'student_id'],
        name: 'unique_internship_student'
      }
    ]
  });

  InternshipRegistration.associate = (models) => {
    InternshipRegistration.belongsTo(models.Internship, {
      foreignKey: 'internship_id',
      as: 'internship'
    });
    InternshipRegistration.belongsTo(models.User, {
      foreignKey: 'student_id',
      as: 'student'
    });
  };

  return InternshipRegistration;
};

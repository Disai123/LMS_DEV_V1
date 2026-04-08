const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Internship = sequelize.define('Internship', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL or emoji icon for internship logo'
    },
    // Duration: e.g. "4-12 Weeks"
    duration: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '4-12 Weeks'
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Internship start date'
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Internship end date'
    },
    // Mode: Online / Offline / Hybrid
    mode: {
      type: DataTypes.ENUM('Online', 'Offline', 'Hybrid'),
      allowNull: false,
      defaultValue: 'Online'
    },
    // Certificate type: Completion / Excellence
    certificate_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Completion'
    },
    // Domains offered: JSON array of strings
    domains_offered: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'List of domains offered in this internship'
    },
    // Key features: JSON array of strings
    key_features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Key features of the internship'
    },
    // Outcomes: JSON array of strings
    outcomes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Expected outcomes after completing the internship'
    },
    // Short bullet highlights for card display
    highlights: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Short highlights shown on card (e.g. Project Based, Mentorship)'
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'active', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'active'
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Max registrations
    max_registrations: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum number of students that can register'
    },
    current_registrations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    tableName: 'internships',
    timestamps: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['is_published'] },
      { fields: ['created_by'] }
    ]
  });

  Internship.associate = (models) => {
    Internship.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Internship.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });
    Internship.hasMany(models.InternshipRegistration, {
      foreignKey: 'internship_id',
      as: 'registrations',
      onDelete: 'CASCADE'
    });
    Internship.belongsToMany(models.User, {
      through: models.InternshipRegistration,
      foreignKey: 'internship_id',
      otherKey: 'student_id',
      as: 'registeredStudents'
    });
  };

  return Internship;
};

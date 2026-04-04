const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    google_id: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [6, 255]
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'student'),
      defaultValue: 'student',
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    reset_password_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    plan_type: {
      type: DataTypes.ENUM('free', 'premium'),
      defaultValue: 'free',
      allowNull: false
    },
  }, {
    tableName: 'users',
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['google_id']
      },
      {
        fields: ['role']
      },
      {
        fields: ['is_active']
      }
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.last_login) {
          user.last_login = new Date();
        }
        // Hash password if provided
        if (user.password) {
          const bcrypt = require('bcryptjs');
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('last_login')) {
          user.last_login = new Date();
        }
        // Hash password if it's being updated
        if (user.changed('password') && user.password) {
          const bcrypt = require('bcryptjs');
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      afterCreate: async (user) => {
        // Automatically create StudentPermission record for new student users
        if (user.role === 'student') {
          const { StudentPermission } = require('./index');
          await StudentPermission.create({
            student_id: user.id,
            courses: true,
            hackathons: true,
            realtime_projects: true
          });
          console.log(`Created permissions for new student: ${user.email}`);
        }
      }
    }
  });

  // Instance methods
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.google_id;
    delete values.password;
    return values;
  };

  User.prototype.getPublicProfile = function () {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      role: this.role,
      plan_type: this.plan_type,
      is_active: this.is_active,
      last_login: this.last_login,
      created_at: this.created_at,
      updated_at: this.updated_at,
      permissions: this.permissions || null
    };
  };

  User.prototype.isAdmin = function () {
    return this.role === 'admin';
  };

  User.prototype.isStudent = function () {
    return this.role === 'student';
  };

  User.prototype.comparePassword = async function (candidatePassword) {
    if (!this.password) {
      return false;
    }
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.generatePasswordResetToken = async function () {
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Set token and expiration (1 hour from now)
    this.reset_password_token = hashedToken;
    this.reset_password_expires = new Date(Date.now() + 3600000); // 1 hour

    await this.save();

    // Return the unhashed token to send via email
    return resetToken;
  };

  User.prototype.isResetTokenValid = function () {
    if (!this.reset_password_token || !this.reset_password_expires) {
      return false;
    }
    return new Date() < new Date(this.reset_password_expires);
  };

  User.prototype.clearResetToken = async function () {
    this.reset_password_token = null;
    this.reset_password_expires = null;
    await this.save();
  };


  // Class methods
  User.findByEmail = function (email) {
    return this.findOne({ where: { email } });
  };

  User.findByGoogleId = function (googleId) {
    return this.findOne({ where: { google_id: googleId } });
  };

  User.findActiveUsers = function () {
    return this.findAll({ where: { is_active: true } });
  };

  User.findByRole = function (role) {
    return this.findAll({ where: { role, is_active: true } });
  };

  User.findByResetToken = async function (token) {
    const bcrypt = require('bcryptjs');
    const { Op } = require('sequelize');

    // Find all users with non-null reset tokens that haven't expired
    const users = await this.findAll({
      where: {
        reset_password_token: { [Op.ne]: null },
        reset_password_expires: { [Op.gt]: new Date() }
      }
    });

    // Check each user's hashed token against the provided token
    for (const user of users) {
      const isMatch = await bcrypt.compare(token, user.reset_password_token);
      if (isMatch) {
        return user;
      }
    }

    return null;
  };

  return User;
};

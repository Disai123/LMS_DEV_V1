const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define('Certificate', {
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
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    certificate_type: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'course'
    },
    test_attempt_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'test_attempts',
        key: 'id'
      }
    },
    certificate_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    issued_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    certificate_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    verification_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'certificates',
    indexes: [
      {
        fields: ['student_id']
      },
      {
        fields: ['course_id']
      },
      {
        fields: ['certificate_type']
      },
      {
        fields: ['test_attempt_id']
      },
      {
        fields: ['certificate_number']
      },
      {
        fields: ['verification_code']
      },
      {
        fields: ['is_valid']
      }
    ]
  });

  // Instance methods
  Certificate.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  Certificate.prototype.getPublicInfo = function() {
    const values = this.get();
    return {
      id: values.id,
      student_id: values.student_id || values.studentId,
      course_id: values.course_id || values.courseId,
      certificate_type: values.certificate_type || values.certificateType,
      certificate_number: values.certificate_number || values.certificateNumber,
      issued_date: values.issued_date || values.issuedDate,
      expiry_date: values.expiry_date || values.expiryDate,
      certificate_url: values.certificate_url || values.certificateUrl,
      verification_code: values.verification_code || values.verificationCode,
      is_valid: values.is_valid !== undefined ? values.is_valid : values.isValid,
      metadata: values.metadata,
      created_at: values.created_at || values.createdAt,
      updated_at: values.updated_at || values.updatedAt
    };
  };

  Certificate.prototype.revoke = function() {
    this.is_valid = false;
    return this.save();
  };

  Certificate.prototype.renew = function() {
    this.is_valid = true;
    return this.save();
  };

  // Class methods
  Certificate.findByStudent = function(studentId) {
    return this.findAll({
      where: { student_id: studentId },
      order: [['issued_date', 'DESC']]
    });
  };

  Certificate.findByCourse = function(courseId) {
    return this.findAll({
      where: { course_id: courseId },
      order: [['issued_date', 'DESC']]
    });
  };

  Certificate.findByCertificateNumber = function(certificateNumber) {
    return this.findOne({
      where: { certificate_number: certificateNumber }
    });
  };

  Certificate.findByVerificationCode = function(verificationCode) {
    return this.findOne({
      where: { verification_code: verificationCode }
    });
  };

  Certificate.generateCertificateNumber = async function(studentId, courseIdOrProjectId, type = 'course') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const prefix = type === 'realtime_project' ? 'CERT-RT' : 'CERT';
    return `${prefix}-${studentId}-${courseIdOrProjectId}-${timestamp}-${random}`;
  };

  Certificate.generateVerificationCode = function() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  return Certificate;
};

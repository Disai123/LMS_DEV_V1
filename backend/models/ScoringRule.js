const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ScoringRule = sequelize.define('ScoringRule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rule_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'course_completion, project_approval, hackathon_approval, master_certificate'
    },
    rule_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'default, beginner, intermediate, advanced, ranking_1, etc.'
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional conditions or notes'
    }
  }, {
    tableName: 'scoring_rules',
    indexes: [
      {
        unique: true,
        fields: ['rule_type', 'rule_key'],
        name: 'unique_scoring_rule'
      },
      {
        fields: ['rule_type']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Instance methods
  ScoringRule.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Class methods
  ScoringRule.findByTypeAndKey = function(ruleType, ruleKey) {
    return this.findOne({
      where: {
        rule_type: ruleType,
        rule_key: ruleKey,
        is_active: true
      }
    });
  };

  ScoringRule.findByType = function(ruleType) {
    return this.findAll({
      where: {
        rule_type: ruleType,
        is_active: true
      },
      order: [['points', 'DESC']]
    });
  };

  ScoringRule.getAllActive = function() {
    return this.findAll({
      where: {
        is_active: true
      },
      order: [['rule_type', 'ASC'], ['points', 'DESC']]
    });
  };

  return ScoringRule;
};


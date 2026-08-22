const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';

function isSqlite() {
  return config[env]?.dialect === 'sqlite';
}

/** JSON column type — works on SQLite and PostgreSQL */
function jsonColumn(DataTypes) {
  return DataTypes.JSON;
}

/** Case-insensitive LIKE for cross-dialect search */
function ilikeOp(sequelize, column, term) {
  const { Op } = sequelize;
  const pattern = `%${term}%`;
  if (isSqlite()) {
    return sequelize.where(
      sequelize.fn('LOWER', sequelize.col(column)),
      { [Op.like]: pattern.toLowerCase() }
    );
  }
  return { [column]: { [Op.iLike]: pattern } };
}

/** Search within course tags stored as JSON array */
function tagsSearchLiteral(sequelize, term) {
  const escaped = term.replace(/'/g, "''");
  if (isSqlite()) {
    return sequelize.literal(`(
      tags LIKE '%${escaped}%' OR
      EXISTS (SELECT 1 FROM json_each(tags) WHERE LOWER(value) LIKE '%${escaped.toLowerCase()}%')
    )`);
  }
  return sequelize.literal(`EXISTS (
    SELECT 1 FROM unnest(tags) AS tag
    WHERE tag ILIKE '%${escaped}%'
  )`);
}

/** Parse JSON array fields when reading from SQLite text */
function jsonArrayGetter(fieldName) {
  return function () {
    const raw = this.getDataValue(fieldName);
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return raw || [];
  };
}

function jsonArraySetter(fieldName) {
  return function (val) {
    this.setDataValue(fieldName, val == null ? [] : val);
  };
}

module.exports = {
  isSqlite,
  jsonColumn,
  ilikeOp,
  tagsSearchLiteral,
  jsonArrayGetter,
  jsonArraySetter
};

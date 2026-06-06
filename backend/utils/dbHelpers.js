const { Op, fn, col, where } = require('sequelize');

function isSqlite(sequelize) {
  return sequelize.getDialect() === 'sqlite';
}

function caseInsensitiveMatch(sequelize, columnRef, term) {
  const pattern = `%${term}%`;

  if (isSqlite(sequelize)) {
    const colName = columnRef.replace(/^\$|\$/g, '');
    return where(fn('LOWER', col(colName)), Op.like, pattern.toLowerCase());
  }

  return { [columnRef]: { [Op.iLike]: pattern } };
}

function tagsSearchCondition(sequelize, searchTerm) {
  const escaped = searchTerm.replace(/'/g, "''");

  if (isSqlite(sequelize)) {
    return sequelize.literal(`tags LIKE '%${escaped}%'`);
  }

  return sequelize.literal(`EXISTS (
    SELECT 1 FROM unnest(tags) AS tag
    WHERE tag ILIKE '%${escaped}%'
  )`);
}

function buildTextSearchOr(sequelize, fields, searchTerm) {
  return {
    [Op.or]: fields.map((field) => caseInsensitiveMatch(sequelize, field, searchTerm))
  };
}

module.exports = {
  isSqlite,
  caseInsensitiveMatch,
  tagsSearchCondition,
  buildTextSearchOr
};

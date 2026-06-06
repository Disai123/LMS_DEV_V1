function arrayType(sequelize, DataTypes, elementType = DataTypes.STRING) {
  if (sequelize.getDialect() === 'sqlite') {
    return DataTypes.JSON;
  }
  return DataTypes.ARRAY(elementType);
}

function jsonType(sequelize, DataTypes) {
  if (sequelize.getDialect() === 'sqlite') {
    return DataTypes.JSON;
  }
  return DataTypes.JSONB;
}

module.exports = {
  arrayType,
  jsonType
};

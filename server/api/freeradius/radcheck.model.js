'use strict';

export default function(sequelize, DataTypes) {
  var radcheck = sequelize.define('radcheck', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    attribute: {
      type: DataTypes.STRING,
      allowNull: false
    },
    op: {
      type: DataTypes.CHAR(2),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    tableName: 'radcheck',
    createdAt: false,
    updatedAt: false,
    deletedAt: false
  });

  return radcheck;
}

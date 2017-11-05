'use strict';

export default function(sequelize, DataTypes) {
  var radreply = sequelize.define('radreply', {
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
    tableName: 'radreply',
    createdAt: false,
    updatedAt: false,
    deletedAt: false
  });

  return radreply;
}

'use strict';

export default function(sequelize, DataTypes) {
  var userinfo = sequelize.define('userinfo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(128)
    },
    firstname: {
      type: DataTypes.STRING(200)
    },
    lastname: {
      type: DataTypes.STRING(200)
    },
    email: {
      type: DataTypes.STRING(200)
    },
    department: {
      type: DataTypes.STRING(200)
    },
    company: {
      type: DataTypes.STRING(200)
    },
    workphone: {
      type: DataTypes.STRING(200)
    },
    homephone: {
      type: DataTypes.STRING(200)
    },
    mobilephone: {
      type: DataTypes.STRING(200)
    },
    address: {
      type: DataTypes.STRING(200)
    },
    city: {
      type: DataTypes.STRING(200)
    },
    state: {
      type: DataTypes.STRING(200)
    },
    country: {
      type: DataTypes.STRING(100)
    },
    zip: {
      type: DataTypes.STRING(200)
    },
    notes: {
      type: DataTypes.STRING(200)
    },
    changeuserinfo: {
      type: DataTypes.STRING(128)
    },
    portalloginpassword: {
      type: DataTypes.STRING(200)
    },
    enableportallogin: {
      type: DataTypes.INTEGER
    },
    creationdate: {
      type: DataTypes.DATE
    },
    creationby: {
      type: DataTypes.STRING(128)
    },
    updatedate: {
      type: DataTypes.DATE
    },
    updateby: {
      type: DataTypes.STRING(128)
    }
  }, {
    freezeTableName: true,
    tableName: 'userinfo',
    createdAt: false,
    updatedAt: false,
    deletedAt: false
  });

  // Create table (daloradius specific)
  userinfo.sync({force: false});

  return userinfo;
}

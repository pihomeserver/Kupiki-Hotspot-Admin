'use strict';

export default function(sequelize, DataTypes) {
  var radacct = sequelize.define('radacct', {
    radacctid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    acctsessionid: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    acctuniqueid: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    groupname: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    realm: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    nasipaddress: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    nasportid: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    nasporttype: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    acctupdatetime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    acctstarttime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    acctstoptime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    acctsessiontime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    acctauthentic: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    connectinfo_start: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    connectinfo_stop: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    acctinputoctets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    acctoutputoctets: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    calledstationid: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    callingstationid: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    acctterminatecause: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    servicetype: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    framedprotocol: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    framedipaddress: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    acctstartdelay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    acctstopdelay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    xascendsessionsvrkey: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    freezeTableName: true,
    tableName: 'radacct',
    createdAt: false,
    updatedAt: false,
    deletedAt: false
  });

  return radacct;
}

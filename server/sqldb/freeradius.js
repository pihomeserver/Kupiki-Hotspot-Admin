'use strict';

// import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.freeradius)
};

// Insert models below
db.radcheck = db.sequelize.import('../api/freeradius/radcheck.model');
db.radreply = db.sequelize.import('../api/freeradius/radreply.model');
db.radacct  = db.sequelize.import('../api/freeradius/radacct.model');
db.userinfo  = db.sequelize.import('../api/freeradius/userinfo.model');

module.exports = db;

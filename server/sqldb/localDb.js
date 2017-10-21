'use strict';

// import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.localDb.uri, config.sequelize.localDb.options)
};

// Insert models below
db.User = db.sequelize.import('../api/user/user.model');

module.exports = db;

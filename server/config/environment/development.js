'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection options
  sequelize: {
    localDb: {
      uri: 'sqlite://',
      options: {
        logging: false,
        storage: 'dev.sqlite',
        define: {
          timestamps: false
        }
      }
    },
    freeradius: {
      username: 'root',
      password: 'raspbian',
      database: 'radius',
      host: '192.168.1.43',
      dialect: 'mariadb',
      insecureAuth : true
    }
  },

  // Seed database on startup
  seedDB: true

};

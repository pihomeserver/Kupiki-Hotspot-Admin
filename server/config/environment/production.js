'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.ip
    || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.PORT
    || 8080,

  sequelize: {
    localDb: {
      uri: process.env.SEQUELIZE_URI
      || 'sqlite://',
      options: {
        logging: false,
        storage: 'dist.sqlite',
        define: {
          timestamps: false
        }
      }
    },
    freeradius: {
      username: 'root',
      password: 'raspbian',
      database: 'radius',
      host: '127.0.0.1',
      dialect: 'mariadb',
      insecureAuth : true
    }
  },
  seedDB: true
};

/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb/localDb';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    let User = sqldb.User;

    return User.findOrCreate({
      where: {
        username: 'admin'
      },
      defaults: {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        username: 'admin',
        // email: 'admin@example.com',
        password: 'admin'
      }

    })
      .then(() => console.log('finished populating users'))
      .catch(err => console.log('error populating users', err));

    // return User.destroy({ where: {} })
    //   .then(() => User.bulkCreate([{
    //     provider: 'local',
    //     role: 'admin',
    //     name: 'Admin',
    //     username: 'admin',
    //     email: 'admin@example.com',
    //     password: 'admin'
    //   }])
    //     .then(() => console.log('finished populating users'))
    //     .catch(err => console.log('error populating users', err)));
  }
}

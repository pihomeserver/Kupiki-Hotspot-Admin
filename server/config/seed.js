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
        language: 'en',
        role: 'admin',
        name: 'Admin',
        username: 'admin',
        password: 'admin'
      }

    })
      .then(() => console.log('finished populating users'))
      .catch(err => console.log('error populating users', err));
  }
}

'use strict';

import Sequelize from 'sequelize';

import freeradiusDb from '../../sqldb/freeradius';

import {radcheck} from '../../sqldb/freeradius';
import {radacct}  from '../../sqldb/freeradius';

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

export function getUsers(req, res) {
  var findUsers = "" +
    "SELECT DISTINCT(radcheck.username), radcheck.`value`, radcheck.id, radusergroup.groupname as groupname " +
    "FROM radcheck " +
    "LEFT JOIN radusergroup ON radcheck.username=radusergroup.username " +
    "WHERE (Attribute='Auth-Type') or (Attribute LIKE '%-Password') GROUP BY UserName";
  freeradiusDb.sequelize.query(findUsers, { type: Sequelize.QueryTypes.SELECT })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

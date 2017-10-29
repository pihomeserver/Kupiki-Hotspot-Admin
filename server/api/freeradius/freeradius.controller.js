'use strict';

import Sequelize from 'sequelize';

import freeradiusDb from '../../sqldb/freeradius';

import {radcheck} from '../../sqldb/freeradius';
import {radacct}  from '../../sqldb/freeradius';
import {userinfo}  from '../../sqldb/freeradius';

function handleError(res, statusCode) {
  // console.log(res)
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

export function getUsers(req, res) {
  var findUsers = "SELECT DISTINCT(radcheck.username), radcheck.`value`, radcheck.id, radusergroup.groupname as groupname FROM radcheck LEFT JOIN radusergroup ON radcheck.username=radusergroup.username WHERE (Attribute='Auth-Type') or (Attribute LIKE '%-Password') GROUP BY UserName";
  freeradiusDb.sequelize.query(findUsers, { type: Sequelize.QueryTypes.SELECT })
    .then(users => {
      // users.reduce(function(promise) {
      //   return promise.then(function() {
      //     return db.getUser(email).done(function(res) {
      //       logger.log(res);
      //     });
      //   });
      // }, Promise.resolve())
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

export function getUserRadcheck(req, res) {
  return radcheck.findAll({
    where: {
      username: req.query.username
    },
    attributes: { exclude : ['createdAt', 'updatedAt'] }
  }).then(userCheckAttributes => {
      res.status(200).json(userCheckAttributes);
    })
    .catch(handleError(res));
}

export function getUserUserinfo(req, res) {
  return userinfo.findOrCreate({
    where: {
      username: req.query.username
    },
    attributes: { exclude : ['createdAt', 'updatedAt'] }
  }).then(userInfo => {
    // Exclude status (if created or not)
    res.status(200).json(userInfo[0]);
  })
  .catch(handleError(res));
}

export function saveUserUserinfo(req, res) {
  var userinfoData = JSON.parse(req.query.userinfo);
  return userinfo.update({
    firstname             : userinfoData.firstname,
    lastname              : userinfoData.lastname,
    email                 : userinfoData.email,
    department            : userinfoData.department,
    company               : userinfoData.company,
    workphone             : userinfoData.workphone,
    homephone             : userinfoData.homephone,
    mobilephone           : userinfoData.mobilephone,
    address               : userinfoData.address,
    city                  : userinfoData.city,
    state                 : userinfoData.state,
    country               : userinfoData.country,
    zip                   : userinfoData.zip,
    notes                 : userinfoData.notes,
    changeuserinfo        : userinfoData.changeuserinfo?parseInt(userinfoData.changeuserinfo):0,
    portalloginpassword   : userinfoData.portalloginpassword,
    enableportallogin     : userinfoData.enableportallogin?parseInt(userinfoData.enableportallogin):0
  }, {
      where: { id: userinfoData.id }
  }).then(resUserInfo => {
    res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
  })
  .catch(error => {
    res.status(200).json({ status: 'failed', result: { code : 500, message : 'Error while saving data' }});
    // handleError(res)
  });
}

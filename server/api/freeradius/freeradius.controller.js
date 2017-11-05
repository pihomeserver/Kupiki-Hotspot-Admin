'use strict';

import Sequelize from 'sequelize';
import async from 'async';
import freeradiusDb from '../../sqldb/freeradius';
import {radcheck} from '../../sqldb/freeradius';
import {radreply} from '../../sqldb/freeradius';
import {radacct}  from '../../sqldb/freeradius';
import {userinfo}  from '../../sqldb/freeradius';
import * as script from '../../system/system.service';


function handleError(res, statusCode) {
  // console.log(res)
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

export function disconnectUser(req, res) {
  script.execPromise('freeradius disconnect '+req.query.username)
    .then(function (result) {
      res.status(200).json({status: 'success', result: {code: 0, message: result.stdout }});
    })
    .catch(function (error) {
      console.log(error);
      res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
    });
}

export function checkUserConnectivity(req, res) {
  script.execPromise('freeradius check '+req.query.username+' '+req.query.password)
    .then(function (result) {
      res.status(200).json({status: 'success', result: {code: 0, message: result.stdout }});
    })
    .catch(function (error) {
      console.log(error);
      res.status(200).json({ status: 'failed', result: { code : error.code, message : error.stderr }});
    });
}

export function getUsers(req, res) {
  let findUsers = "SELECT username, firstname, lastname FROM userinfo UNION DISTINCT SELECT radcheck.username, userinfo.firstname, userinfo.lastname FROM radcheck, userinfo WHERE radcheck.username = userinfo.username UNION DISTINCT SELECT radreply.username, userinfo.firstname, userinfo.lastname FROM radreply, userinfo WHERE radreply.username = userinfo.username";
  freeradiusDb.sequelize.query(findUsers, { type: Sequelize.QueryTypes.SELECT })
    .then(users => {
      res.status(200).json(users);
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
  return upsert(userinfo, {
      username: userinfoData.username
    }, {
      username              : userinfoData.username,
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
    }).then(resUserInfo => {
      res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
    })
    .catch(error => {
      res.status(200).json({ status: 'failed', result: { code : 500, message : 'Error while saving data' }});
    });
}

function upsert(model, condition, values) {
  return model
    .findOne({ where: condition })
    .then(function(obj) {
      if(obj) { // update
        console.log(obj);
        return obj.update(values);
      }
      else { // insert
        console.log(values)
        return model.create(values);
      }
    })
}

export function createUser(req, res) {
  console.log(req.body);
  userinfo.create({ username: req.body.username }).then(result => {
    res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
  }).catch(handleError(res));
}

export function deleteUser(req, res) {
  console.log(req.body);
  let asyncs = [];
  asyncs.push(function(callback) {
    radcheck.destroy({ where: { username: req.body.username }}).then(function(result) {
      callback();
    });
  });
  asyncs.push(function(callback) {
    userinfo.destroy({ where: { username: req.body.username }}).then(function(result) {
      callback();
    });
  });
  async.series(asyncs, function(err) {
    if (!err) {
      res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
    } else {
      console.log(err)
      res.status(200).json({ status: 'failed', result: { code : 500, message : 'Unable to delete userinfo and attributes' }});
    }
  });
}

export function getUserRadreply(req, res) {
  return radreply.findAll({
    where: {
      username: req.query.username
    },
    attributes: { exclude : ['createdAt', 'updatedAt'] }
  }).then(userReplyAttributes => {
    res.status(200).json(userReplyAttributes);
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

export function saveUserRadcheck(req, res) {
  console.log(req.query.radcheck);

  let attributes = [];
  (Array.isArray(req.query.radcheck))?attributes = req.query.radcheck:attributes.push(req.query.radcheck);

  console.log(attributes)

  if ( req.query.username ) {
    let asyncs = [];

    radcheck.destroy({
      where: {
        username: req.query.username
      }
    }).then(error => {
      attributes.forEach(attributeStr => {
        let attribute = JSON.parse(attributeStr);
        console.log(attribute);
        asyncs.push(function(callback) {
          radcheck.create({username: attribute.username, attribute: attribute.attribute, op: attribute.op, value: attribute.value }).then(function(result){
            callback();
          });
        });
      });
      async.series(asyncs, function(err) {
        if (!err) {
          res.status(200).json({ status: 'success', result: { code : 0, message : '' }});
        } else {
          console.log(err);
          res.status(200).json({ status: 'failed', result: { code : 500, message : 'Unable to update attributes' }});
        }
      });
    });
  } else {
    res.status(200).json({ status: 'failed', result: { code : 500, message : 'Attributes is not array' }});

  }
}

export function getLastSession(req, res) {
  return radacct.findAll({
    limit: 1,
    where: {
      username: req.query.username
    },
    order: [ [ 'acctstarttime', 'DESC' ]],
    attributes: { exclude : ['createdAt', 'updatedAt'] }
  }).then(userLastSession => {
    res.status(200).json(userLastSession);
  })
    .catch(handleError(res));
}

export function getAllSessions(req, res) {
  return radacct.findAll({
    where: {
      username: req.query.username
    },
    order: [ [ 'acctstarttime', 'ASC' ]],
    attributes: { exclude : ['createdAt', 'updatedAt'] }
  }).then(userAllSessions => {
    res.status(200).json(userAllSessions);
  })
    .catch(handleError(res));
}

export function getSessionsTotal(req, res) {
  let getAllStats = "SELECT count(radacctid) as sessionsCount, sum(acctsessiontime) as sessionsTime, sum(acctinputoctets) as downloadTotal, sum(acctoutputoctets) as uploadTotal FROM radacct WHERE username = '"+req.query.username+"'";
  freeradiusDb.sequelize.query(getAllStats, { type: Sequelize.QueryTypes.SELECT })
    .then(stats => {
      res.status(200).json(stats);
    })
    .catch(handleError(res));
}


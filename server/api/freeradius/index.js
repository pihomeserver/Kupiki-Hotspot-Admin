'use strict';

import {Router} from 'express';
import * as controller from './freeradius.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/users', auth.hasRole('admin'), controller.getUsers);

router.get('/user/radcheck', auth.hasRole('admin'), controller.getUserRadcheck);
router.post('/user/radcheck', auth.hasRole('admin'), controller.saveUserRadcheck);

router.get('/user/radreply', auth.hasRole('admin'), controller.getUserRadreply);

router.get('/user/userinfo', auth.hasRole('admin'), controller.getUserUserinfo);
router.post('/user/userinfo', auth.hasRole('admin'), controller.saveUserUserinfo);

router.get('/lastsession', auth.hasRole('admin'), controller.getLastSession);
router.get('/sessionstotal', auth.hasRole('admin'), controller.getSessionsTotal);
router.get('/allsessions', auth.hasRole('admin'), controller.getAllSessions);
router.post('/check', auth.hasRole('admin'), controller.checkUserConnectivity);
router.post('/disconnect', auth.hasRole('admin'), controller.disconnectUser);
router.post('/delete', auth.hasRole('admin'), controller.deleteUser);
router.post('/create', auth.hasRole('admin'), controller.createUser);

module.exports = router;

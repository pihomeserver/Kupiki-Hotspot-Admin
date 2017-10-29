'use strict';

import {Router} from 'express';
import * as controller from './freeradius.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/users', auth.hasRole('admin'), controller.getUsers);
router.get('/user/radcheck', auth.hasRole('admin'), controller.getUserRadcheck);
router.get('/user/userinfo', auth.hasRole('admin'), controller.getUserUserinfo);
router.post('/user/userinfo', auth.hasRole('admin'), controller.saveUserUserinfo);

module.exports = router;

'use strict';

import {Router} from 'express';
import * as controller from './freeradius.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/users', auth.hasRole('admin'), controller.getUsers);

module.exports = router;

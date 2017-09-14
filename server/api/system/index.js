'use strict';

var express = require('express');
import * as auth from '../../auth/auth.service';
var controller = require('./system.controller');

var router = express.Router();

router.get('/reboot', auth.isAuthenticated(), controller.reboot);
router.get('/shutdown', auth.isAuthenticated(), controller.shutdown);
router.get('/update', auth.isAuthenticated(), controller.update);
router.get('/upgrade', auth.isAuthenticated(), controller.upgrade);

module.exports = router;

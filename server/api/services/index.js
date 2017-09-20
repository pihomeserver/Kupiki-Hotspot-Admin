'use strict';

var express = require('express');
import * as auth from '../../auth/auth.service';
var controller = require('./services.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.switchService);

module.exports = router;

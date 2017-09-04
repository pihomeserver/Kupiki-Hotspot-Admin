'use strict';

var express = require('express');
import * as auth from '../../auth/auth.service';
var controller = require('./disk.controller');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);

module.exports = router;

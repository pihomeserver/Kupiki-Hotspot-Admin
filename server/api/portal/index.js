'use strict';

var express = require('express');
import * as auth from '../../auth/auth.service';
var controller = require('./portal.controller');

var router = express.Router();

router.post('/background', auth.isAuthenticated(), controller.uploadBackground);
router.post('/defaultbackground', auth.isAuthenticated(), controller.restoreBackground);

module.exports = router;

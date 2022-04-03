'use strict';
var express = require('express');
var router = express.Router();

/* Get roles */
router.get('/', function (req, res) {
    res.send('Admin, Write and Read');
});

module.exports = router;

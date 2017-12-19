'use strict';

const express = require('express'),
    router = express.Router(),
    Controller = require('./../app/').campaignsController;

function getController(request, response) {
    return new Controller(request, response);
}

router.get('/', function(req, res, next) {
    getController(req, res)
        .getLogAction(req.query.filter)
});

module.exports = router;

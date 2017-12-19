'use strict';

const express = require('express'),
    router = express.Router(),
    Controller = require('./../app/').campaignsController;

function getController(request, response) {
    return new Controller(request, response);
}

router.get('/', function(req, res, next) {
    getController(req, res)
        .campaignsAction(req.query.id)
});

router.get('/:id/stats/apps', function(req, res, next) {
    getController(req, res)
        .resourceAction(req.params.id)
});

module.exports = router;

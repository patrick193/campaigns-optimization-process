'use strict';

const api_config = require('../../configs/index').api;
const PREG_MATCH = /\{(.*?)\}/;
const PREG_REPLACE = /\{(.*?)\}/g;

class Options {

    constructor({
                    host = api_config.nuviad_host,
                    port = api_config.port,
                    path = '/',
                    method = 'GET',
                    headers = {
                        'Content-Type': 'application/json'
                    }
                } = {}) {
        this.host = host;
        this.port = port;
        this.path = path;
        this.method = null;
        this.headers = headers;
        this._method = method;
    }

    /**
     * setter for method; define a method type;
     * @param method
     * @returns {*}
     * @private
     */
    set _method(method) {
        if (['POST', 'PUT', 'UPDATE'].indexOf(method.toUpperCase()) !== -1) {
            this.json = {};
        }

        return this.method = method;
    }
}

module.exports = Options;

/**
 * decorator for getting all options what we need
 * @param endPoint
 * @param params
 * @returns {Options}
 */
module.exports.getOptionsByEndPoint = (endPoint, params = {}) => {
    let path = endPoint.point,
        keyName = path.match(PREG_MATCH),
        keys = Object.keys(params),
        hasParams = PREG_MATCH.test(path);

    if (hasParams &&
        keyName.length &&
        keys.indexOf(keyName[1]) !== -1) {
        path = path.replace(PREG_REPLACE, params[keyName[1]]);
    }

    return new Options({
        path: path,
        method: endPoint.method
    })
};
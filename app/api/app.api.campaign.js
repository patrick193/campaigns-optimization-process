'use strict';

const http = require('http'),
    https = require('https');

class ApiCampaigns {
    constructor() {
    }


    /**
     * alias for easy reading
     * @param options
     * @returns {Promise}
     */
    getCampaigns(options) {
        return this.get(options);
    }

    /**
     * alias for easy reading
     * @param options
     * @returns {Promise}
     */
    getResource(options) {
        return this.get(options);
    }

    /**
     * alias for easy reading
     * @param options
     * @param data
     * @returns {Promise.<*>}
     */
    updateCampaign(options, data = {}) {
      return this.post(options, data);
    }


    /**
     response WTF??? {
    "error": {
            "name": "mockRequestNotFoundError",
            "message": "We were unable to find any matching requests for this method type and the mock path, '/campaigns/ceecf7e1-a24d-428b-b013-8526e848ce3d/update_bid', in your collection."
             }
     }
     * @param options
     * @param data
     * @returns {Promise.<*>}
     */
    async post(options, data = {}) {
        try {
            options.json = data;//
            return await this._sendRequest(options);

        } catch (err) {
            console.log(err);
            return {};// think how to throw exception; we can not throw an exception because we need to finish processing...
        }
    }

    async get(options) {
        try {
            return await this._sendRequest(options);
        } catch (err) {
            console.log(err);
            return {};// think how to throw exception; we can not throw an exception because we need to finish processing...
        }
    }

    /**
     * handle request
     * @private
     * @param {Options} options
     * @returns {Promise}
     */
    _sendRequest(options) {
        return new Promise((resolve, reject) => {
            let provider = options.port === 443 ? https : http,
                req = provider.request(options, res => {
                    let output = '';
                    res.setEncoding('utf8');

                    res.on('data', function (chunk) {
                        output += chunk;
                    });

                    res.on('end', function () {
                        if (!output && res.statusCode !== 200) {
                            reject('Error while getting a data');
                            return false;
                        }
                        let obj = JSON.parse(output);
                        res.statusCode === 200 ? resolve(obj) : reject(obj);
                    });
                });

            req.on('error', err => {
                reject(err);
            });

            req.end();
        });

    }
}


module.exports = new ApiCampaigns();
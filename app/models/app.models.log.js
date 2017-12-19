'use strict';

const BasicModel = require('./basic.model').BasicModel;

/**
 *
 */
class Log extends BasicModel {

    /**
     * late static binding using
     * @returns {string}
     * @private
     */
    static _tableName() {
        return 'pt_campaigns_update_log';
    }

    constructor(data = {}) {
        super();

        this.id = data.id || 0;
        this.campaign_id = data.campaign_id || '';
        this.app_id = data.app_id || '';
        this.old_bid = data.old_bid || 0.0;
        this.new_bid = data.new_bid || 0.0;
        this.created_at + data.created_at || new Date();

    }
}

module.exports = Log;
module.exports.table = Log._tableName();
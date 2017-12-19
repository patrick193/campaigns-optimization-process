'use strict';

const DB = require('./../../db').db_instance;
const LOG_TABLE = require('./../../models').log_model.table;

class Logger {

    /**
     * save data after processing to db
     * @param data
     * @returns {Promise}
     */
    static log(data) {
        return DB.insert({table: LOG_TABLE, data: data});
    }
}

module.exports = Logger;
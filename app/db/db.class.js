'use strict';

const mysql = require('mysql'),
    dbConfig = require('./../configs').db;

class Db {

    /**
     *
     */
    constructor() {
        this.conn = mysql.createConnection(dbConfig);
    }

    /**
     *
     * @returns {Promise}
     */
    connect() {
        if (!this.conn) {
            throw new Error('No connection defined');
        }
        return new Promise((res, rej) => {
            this.conn.ping((err) => {
                if (err) {
                    rej(err);
                    return false;
                }

                this.conn.connect((err) => {
                    if (err) {
                        rej(err);
                    }
                    res()
                })
            })
        });
    }

    /**
     *
     * @returns {Connection|*}
     */
    get connection() {
        if (!this.conn) {
            throw new Error('No connection defined')
        }

        return this.conn;
    }

    /**
     *
     * @param query
     * @param params
     * @returns {Promise}
     */
    query(query, params) {
        return new Promise((res, rej) => {
            this.connection.query(query, params, (err, resuls, fields) => {
                if (err) {
                    rej(err);
                    return false;
                }
                res(resuls, fields);
            })
        })
    }

    /**
     *
     * @param obj
     * @returns {Promise}
     */
    insert({
               table = '',
               data = {}
           } = {}) {
        if (!table) {
            throw new Error('no table')
        }

        let query = "insert into " + table + " (";
        let params = ") values(";
        for (let key in data) {
            query += "`" + key + "`, ";
            params += "'" + data[key] + "', ";
        }
        query = query.slice(0, -2) + params.slice(0, -2) + ")";

        return this.query(query)
    }
}

module.exports = new Db();
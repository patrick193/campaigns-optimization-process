'use strict';

const db = require('./../db').db_instance;
const primaryKey = 'id';

class BasicModel {

    static _tableName() {
      return this.constructor.name.toLowerCase();
    }
    constructor() {
        this.primaryKey = primaryKey;
    }

    static get db() {
        return db;
    }


    /**
     *
     * @param fields
     * @param where
     * @param orderBy
     * @param limit
     * @returns {Promise.<*>}
     */
    static async findAsync({fields = [], where = {}, orderBy = {field: primaryKey, sort: "DESC"}, limit = 50} = {}) {
        try {
            let {sqlQuery, params} = await generateSelectSql(this._tableName(), fields, where, orderBy, limit);// use late static binding for deffing a table name from models

            return await db.query(sqlQuery, params);
        } catch (err) {
            throw new Error(err)
        }
    }
}

/**
 * IST'S NOT INTERESTING! :D just generate an sql query for SELECT;
 * @param tableName
 * @param fields
 * @param where
 * @param orderBy
 * @param limit
 * @returns {{sqlQuery: string, params: Array}}
 */
function generateSelectSql(tableName, fields = [], where = {}, orderBy = {field: primaryKey, sort: "DESC"}, limit = 0) {
    if (!Array.isArray(fields)) {
        orderBy = orderBy || limit;
        limit = 0;
        where = fields;
        fields = [];
    }
    let query = "SELECT ",
        params = [];
    if (!fields.length) {
        query += "*";
    } else {
        fields.forEach((field, index) => {
            if (index) {
                query += ", ";
            }
            query += "`" + field + "`";
        });
    }

    query += " FROM " + tableName;
    let whereKeys = Object.keys(where);
    if (whereKeys.length) {
        query += " WHERE ";
        whereKeys.forEach((key, index) => {
            if (index) {
                query += ", ";
            }
            query += "`" + key + "` = ?";
            params.push(where[key]);
        });
    }
    if (orderBy) {
        query += " ORDER BY " + orderBy.field + " " + orderBy.sort;
    }

    if (limit) {
        query += " LIMIT " + limit;
    }

    return {sqlQuery: query, params: params}
}

module.exports.BasicModel = BasicModel;

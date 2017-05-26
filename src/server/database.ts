import * as knex from "knex"
import * as DB from "../interface/database"

const options = require("../../knexfile").development;
const queryBuilder = knex(options);


export default class Database<T extends DB.Tables> {
    table: T

    constructor(table: T) {
        this.table = table;
    }

    /** Return a query builder for the table */
    knex() {
        return queryBuilder(this.table);
    }

    /** Log the sql error */
    error(error) {
        console.error(error);
    }

    /** [ASYNC] Insert and return the inserted row's ID */
    async insert(data: DB.Insert<T>) {
        return this.knex()
        .insert(data)
        .catch(this.error)
        .then( function(result: number[]) {
            return result
        })
    }

    /** [ASYNC] Get */
    async get(data: DB.Get<T>) {
        return this.knex()
        .where(data)
        .catch(this.error)
        .then( function(result: DB.Shema<T>[]) {
            return result;
        })
    }

    /**
    * [ASYNC] Get by ID
    * Accept a single ID or an array
    */
    async getByID(id: number | number[]) {
        let ids = Array.isArray(id) ? id : [id];

        return this.knex()
        .whereIn("id", ids)
        .catch(this.error)
        .then( function(result: DB.Shema<T>[]) {
            return result;
        })
    }
}

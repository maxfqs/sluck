import * as knex from "knex"
import * as DB from "../interface/database"

const options = require("../../knexfile").development;
const queryBuilder: any = knex(options);


export default class Database<T extends DB.Tables> {
    table: T

    constructor(table: T) {
        this.table = table;
    }

    /** Return a query builder for the table */
    knex() {
        return <DB.QueryBuilder<T>>queryBuilder(this.table);
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

    /** [ASYNC] Get where the data matched */
    async get(data: Partial<DB.Shema<T>>) {
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

    /**
    * [ASYNC] Select
    * Select all if no argument is passed
    */
    async select <K extends DB.ShemaKey<T>> (...args: K[]) {
        return this.knex()
        .select(...args)
        .catch(this.error)
        .then( function(result: Pick<DB.Shema<T>, K>[]) {
            return result;
        })
    }
}

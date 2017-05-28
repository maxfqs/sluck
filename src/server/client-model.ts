import Database from "../server/database"
import {Model} from "../interface/client-model"

const userDB = new Database("users");


/** [ASYNC] Return all the users */
export async function getAllUsers(): Promise< Model<"user">[] > {
    let result = await userDB.select("id", "login");
    return result;
}

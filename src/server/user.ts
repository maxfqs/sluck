import * as crypto from "./crypto"
import Database from "./database"
import {Insert, Get} from "../interface/database"

const userDB = new Database("users");


/**
* [ASYNC] Create a new user and return his id
* Will return false in case of invalid data or unavailable login
*/
export async function create(login: string, password: string) {
    if (login == "" || password == "") {
        return false;
    }

    let validLogin = await isValidLogin(login);
    if (!validLogin) {
        return false;
    }

    let data: Insert<"users"> = {
        login: login,
        password: crypto.encrypt(password)
    }

    let result = await userDB.insert(data);
    return result[0];
}

/**
* [ASYNC] Authentificate the user
* Return his id if successful or false
*/
export async function auth(login: string, password: string) {
    let data: Get<"users"> = {
        login: login,
        password: crypto.encrypt(password)
    }

    let result = await userDB.get(data);

    if (result.length == 0) {
        return false;
    }
    return result[0].id;
}


/** [ASYNC] Check whether the login is available */
async function isValidLogin(login: string) {
    let result = await userDB.get({login: login});
    if (result.length == 0) {
        return true;
    }
    return false;
}

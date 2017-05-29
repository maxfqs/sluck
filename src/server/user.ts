import * as crypto from "./crypto"
import Database from "./database"

const channelDB = new Database("channels");
const userDB = new Database("users");
const userChansDB = new Database("user-channels");


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

    let result = await userDB.insert({
        login: login,
        password: crypto.encrypt(password)
    })

    return result[0];
}

/**
* [ASYNC] Authentificate the user
* Return his id if successful or false
*/
export async function auth(login: string, password: string) {
    let result = await userDB.get({
        login: login,
        password: crypto.encrypt(password)
    })

    if (result.length == 0) {
        return false;
    }
    return result[0].id;
}

/** [ASYNC] Return the user's channels id */
export async function getChannelsID(userID: number) {
    let result = await userChansDB.get({user: userID});
    if (result.length == 0) {
        return [];
    }

    let chanIDS: number[] = [];

    result.forEach( function(shema) {
        chanIDS.push(shema.channel);
    })

    return chanIDS;
}


/** [ASYNC] Check whether the login is available */
async function isValidLogin(login: string) {
    let result = await userDB.get({login: login});
    if (result.length == 0) {
        return true;
    }
    return false;
}

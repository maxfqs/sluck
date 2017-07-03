import * as crypto from "./crypto"
import Database from "./database"
import {Insert} from "../interface/database"

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

    let id = result[0];

    await createPersonnalChannel(id);
    await addToAutoJoinChannel(id);

    return id;
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

/** [ASYNC] Check whether the login is available */
async function isValidLogin(login: string) {
    let result = await userDB.get({login: login});
    if (result.length == 0) {
        return true;
    }
    return false;
}


async function createPersonnalChannel(userID: number) {
    let result = await channelDB.insert({type: "personal"});
    await userChansDB.insert({
        channel: result[0],
        user: userID
    })
}

/** [ASYNC] Add the user to all auto join channels */
async function addToAutoJoinChannel(userID: number) {
    let chans = await channelDB.get({auto_join: true});
    let insertData: Insert<"user-channels">[] = [];

    chans.forEach( function(chan) {
        insertData.push({channel: chan.id, user: userID});
    })

    await userChansDB.insert(insertData);
}

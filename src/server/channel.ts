import Database from "./database"

const channelDB = new Database("channels");


/**
* [ASYNC] Create a channel and return his id
* Will return false in case of invalid data or unavailable name
*/
export async function create(name: string) {
    let validName = await isValidName(name);
    if (!validName) {
        return false;
    }

    let result = await channelDB.insert({name: name});
    return result[0];
}


/** [ASYNC] Check whether the name is valid */
async function isValidName(name: string) {
    if (name == "") {
        return false;
    }

    // Check if already taken
    let result = await channelDB.select({name: name});
    if (result.length != 0) {
        return false;
    }

    return true;
}

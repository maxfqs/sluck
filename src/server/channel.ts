import Database from "./database"
import {Insert} from "../interface/database"


const channelDB = new Database("channels");
const userDB = new Database("users");
const userChanDB = new Database("user-channels");


/**
* [ASYNC] Create a channel and return his id
* Will return false in case of invalid data or unavailable name
*/
export async function create(name: string, autoJoin?: boolean) {
    let validName = await isValidName(name);
    if (!validName) {
        return false;
    }

    let result = await channelDB.insert({
        name: name,
        auto_join: autoJoin || false
    })

    let id = result[0];

    if (!autoJoin) {
        return id;
    }

    await addUsersToChannel(id, true);
    return id;
}


/** [ASYNC] Check whether the name is valid */
async function isValidName(name: string) {
    if (name == "") {
        return false;
    }

    // Check if already taken
    let result = await channelDB.get({name: name});
    if (result.length != 0) {
        return false;
    }

    return true;
}

/**
* [ASYNC] Add users to this channel
* Accept an array of users ID or true (add all users)
*/
async function addUsersToChannel(chanID: number, users: number[] | true) {
    let usersID: number[] = [];

    if (users == true) {
        let result = await userDB.select("id");
        result.forEach( function(data) {
            usersID.push(data.id);
        })
    } else {
        usersID = users;
    }

    let insertData: Insert<"user-channels">[] = [];
    usersID.forEach( function(id) {
        insertData.push({channel: chanID, user: id});
    })

    await userChanDB.insert(insertData);
}

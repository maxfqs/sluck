import Database from "../server/database"
import LiveUser from "../server/live-user"
import {Insert} from "../interface/database"


const channelDB = new Database("channels");
const userDB = new Database("users");
const userChansDB = new Database("user-channels");


/**
* [ASYNC] Create a channel and return his id
* Will return false in case of invalid data or unavailable name
*/
export async function create(name: string, autoJoin?: boolean) {
    let validName = await isValidName(name);
    if (!validName) {
        return false;
    }

    let id = await channelDB.insert({
        name: name,
        auto_join: autoJoin || false
    })

    if (autoJoin) {
        await addUsersToChannel(id, true);
    }

    LiveUser.addChannel(id);
    return id;
}

/** [ASYNC] Create the personal channel for that user */
export async function createPersonnalChannel(userID: number) {
    let chanID = await channelDB.insert({type: "personal"});
    await userChansDB.insert({
        channel: chanID,
        user: userID
    })
}

/** [ASYNC] Create the direct channels for that user */
export async function createDirectChannels(userID: number) {
    let chansID: number[] = [];
    let usersID: number[] = [];
    let chansInsert: Insert<"channels">[] = [];
    let userChansInsert: Insert<"user-channels">[] = [];

    let result = await userDB.select("id");

    // We need a least 2 users for the direct channel to exist
    if (result.length < 2) {
        return false;
    }

    result.forEach( function(r) {
        if (r.id != userID) {
            usersID.push(r.id);
            chansInsert.push({type: "direct"});
        }
    })

    let chanID = await channelDB.insert(chansInsert);

    usersID.forEach( function(id) {
        userChansInsert.push(
            {channel: chanID, user: id},
            {channel: chanID, user: userID}
        )

        chansID.push(chanID);
        chanID++;
    })

    await userChansDB.insert(userChansInsert);

    chansID.forEach( function(id) {
        LiveUser.addChannel(id);
    })
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

    if (usersID.length == 0) {
        return false;
    }

    let insertData: Insert<"user-channels">[] = [];
    usersID.forEach( function(id) {
        insertData.push({channel: chanID, user: id});
    })

    await userChansDB.insert(insertData);
}

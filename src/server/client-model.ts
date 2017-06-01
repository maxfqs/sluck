import Database from "../server/database"
import {Model} from "../interface/client-model"
import {Shema, ShemaKey} from "../interface/database"


const NUMBER_OF_MESSAGES = 30;

const chanDB = new Database("channels");
const messageDB = new Database("messages");
const userDB = new Database("users");


/** [ASYNC] Return all the users */
export async function getAllUsers(): Promise< Model<"user">[] > {
    let result = await userDB.select("id", "login");
    return result;
}

export async function getChannelByID(chanID: number): Promise<Model<"channel">> {
    let chan = await chanDB.getByID(chanID);
    return chan[0];
}

export async function getUserByID(userID: number): Promise<Model<"user">> {
    let result = await userDB.getByID(userID);
    let user = {
        id: result[0].id,
        login: result[0].login
    }
    return user;
}


/** [ASYNC] Return the first message ID for that channel */
export async function getFirstMessageID(chanID: number) {
    return messageDB.knex()
    .select("id")
    .where({channel: chanID})
    .limit(1)
    .catch(messageDB.error)
    .then( function(result: Pick<Shema<"messages">, "id">[]) {
        return (result.length > 0) ? result[0].id : 0;
    })
}

/** [ASYNC] Return the most recent messages of that channel */
export async function getLastMessages(chanID: number): Promise< Model<"message">[] >  {
    return messageDB.knex()
    .where({channel: chanID})
    .orderBy("id", "desc")
    .limit(NUMBER_OF_MESSAGES)
    .catch(messageDB.error)
    .then( function(result: Shema<"messages">[]) {
        return result;
    })
}

/** [ASYNC] Return the messages before the specified id */
export async function getMessagesBefore(chanID: number, messageID: number): Promise< Model<"message">[] > {
    return messageDB.knex()
    .where({channel: chanID})
    .andWhere("id", "<", messageID)
    .orderBy("id", "desc")
    .limit(NUMBER_OF_MESSAGES)
    .catch(messageDB.error)
    .then( function(result: Shema<"messages">[]) {
        return result;
    })
}

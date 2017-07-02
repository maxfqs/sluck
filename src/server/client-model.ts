import Database from "../server/database"
import {Model} from "../interface/client-model"
import {Shema, ShemaKey} from "../interface/database"


const NUMBER_OF_MESSAGES = 30;

const chanDB = new Database("channels");
const messageDB = new Database("messages");
const userDB = new Database("users");


/** [ASYNC] Return all the users */
export async function getAllUsers() {
    let users: Model<"user">[] = await userDB.select("id", "login", "avatar");
    return users;
}

/** [ASYNC] Return users by id */
export async function getUserByID(id: number): Promise<Model<"user">>;
export async function getUserByID(id: number[]): Promise<Model<"user">[]>;

export async function getUserByID(id: number | number[]) {
    let ids = Array.isArray(id) ? id : [id];
    let retval: Model<"user">[] = [];

    let result = await userDB.getByID(ids);
    result.forEach( function(user) {
        retval.push({
            id: user.id,
            login: user.login,
            avatar: user.avatar
        })
    })

    if (retval.length == 1) {
        return retval[0];
    }

    return retval;
}


export async function getChannelByID(chanID: number): Promise<Model<"channel">> {
    let chan = await chanDB.getByID(chanID);
    return chan[0];
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

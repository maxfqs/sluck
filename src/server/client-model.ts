import Database from "../server/database"
import {Model} from "../interface/client-model"
import {Shema, ShemaKey} from "../interface/database"


const NUMBER_OF_MESSAGES = 30;

const messageDB = new Database("messages");
const userDB = new Database("users");


/** [ASYNC] Return all the users */
export async function getAllUsers(): Promise< Model<"user">[] > {
    let result = await userDB.select("id", "login");
    return result;
}

/** [ASYNC] Return the most recent messages of that channel */
export async function getLastMessages(chanID: number): Promise< Model<"message">[] >  {
    let where: Partial<Shema<"messages">> = {channel: chanID};

    return messageDB.knex()
    .where(where)
    .orderBy("id", "desc")
    .limit(NUMBER_OF_MESSAGES)
    .catch(messageDB.error)
    .then( function(result: Shema<"messages">[]) {
        return result;
    })
}

/** [ASYNC] Return the messages before the specified id */
export async function getMessagesBefore(chanID: number, messageID: number): Promise< Model<"message">[] > {
    let where: Partial<Shema<"messages">> = {channel: chanID};

    return messageDB.knex()
    .where(where)
    .andWhere("id", "<", messageID)
    .orderBy("id", "desc")
    .limit(NUMBER_OF_MESSAGES)
    .catch(messageDB.error)
    .then( function(result: Shema<"messages">[]) {
        return result;
    })
}

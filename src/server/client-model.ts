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
    let order: ShemaKey<"messages"> = "id";

    return messageDB.knex()
    .where(where)
    .orderBy(order, "desc")
    .limit(NUMBER_OF_MESSAGES)
    .catch(messageDB.error)
    .then( function(result: Shema<"messages">[]) {
        return result;
    })
}

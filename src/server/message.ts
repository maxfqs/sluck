import Database from "./database"
import * as moment from "moment"
import {Insert} from "../interface/database"

const messageDB = new Database("messages");


/** [ASYNC] Create a message */
export async function create(userID: number, channelID: number, text: string) {
    let data: Insert<"messages"> = {
        user: userID,
        channel: channelID,
        text: text,
        date: moment().format("X")
    }

    let id = await messageDB.insert(data);
    let result = await messageDB.getByID(id);
    return result[0];
}

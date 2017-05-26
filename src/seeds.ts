import * as channel from "./server/channel"
import Database from "./server/database"
import * as user from "./server/user"
import {Insert} from "./interface/database"

const userChanDB = new Database("user-channels");

/** Populate the database with initial data */
async function seeds() {
    let adminID = await user.create("admin", "admin");
    let generalID = await channel.create("general");

    if (!adminID || !generalID) {
        console.error("Error during the seeding of the database");
        return process.exit();
    }

    let data: Insert<"user-channels"> = {
        user: adminID,
        channel: generalID
    }

    let result = await userChanDB.insert(data);

    process.exit();
}

seeds();

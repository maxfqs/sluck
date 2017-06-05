import * as channel from "./server/channel"
import Database from "./server/database"
import * as user from "./server/user"


/** Populate the database with initial data */
async function seeds() {
    await Promise.all([
        channel.create("general", true),
        channel.create("random", true)
    ])

    await user.create("admin", "admin");

    process.exit();
}


seeds();

import * as channel from "./server/channel"
import Database from "./server/database"
import * as user from "./server/user"


/** Populate the database with initial data */
async function seeds() {
    let adminID = await user.create("admin", "admin");

    if (!adminID) {
        console.error("Error during the seeding of the database");
        return process.exit();
    }

    await Promise.all([
        channel.create("general", true),
        channel.create("random", true)
    ])

    process.exit();
}


seeds();

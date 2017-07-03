import {Shema} from "../interface/database"

export type Model<T extends keyof ClientModel> = ClientModel[T]


/**  Models interfaces consumme by the front-end */
interface ClientModel {
    "channel": Channel
    "message": Shema<"messages">
    "user": User
}

interface Channel extends Shema<"channels"> {
    /** Members ids */
    members: number[]
}

interface User {
    /** User ID */
    id: number
    /** Username (unique) */
    login: string
    /** Avatar filename */
    avatar: string
}

import {Shema} from "../interface/database"

export type Model<T extends keyof ClientModel> = ClientModel[T]


/**  Models interfaces consumme by the front-end */
interface ClientModel {
    "channel": Shema<"channels">
    "message": Shema<"messages">
}
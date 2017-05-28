import {Model} from "../interface/client-model"

export type Events = keyof SocketAPI
export type Args<T extends Events> = SocketAPI[T]["args"]
export type RetVal<T extends Events> = SocketAPI[T]["retval"]


interface SocketAPI {
    "init": Init
    "getMessagesRecent": GetMessagesRecent
    "newMessage": NewMessage
    "registerMessage": RegisterMessage
}

interface Init {
    args: null
    retval: {
        channels: Model<"channel">[]
        users: Model<"user">[]
    }
}

interface GetMessagesRecent {
    args: number
    retval: Model<"message">[]
}

interface RegisterMessage {
    args: {channel: number, text: string}
    retval: null
}

interface NewMessage {
    args: Model<"message">
    retval: null
}

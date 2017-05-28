import {Model} from "../interface/client-model"

export type Events = keyof SocketAPI
export type Args<T extends Events> = SocketAPI[T]["args"]
export type RetVal<T extends Events> = SocketAPI[T]["retval"]


interface SocketAPI {
    "init": Init
    "newMessage": NewMessage
    "registerMessage": RegisterMessage
}

interface Init {
    args: null
    retval: { channels: Model<"channel">[] }
}

interface RegisterMessage {
    args: {channel: number, text: string}
    retval: null
}

interface NewMessage {
    args: Model<"message">
    retval: null
}

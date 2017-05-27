import {Shema} from "../interface/database"

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
    retval: {channels: Shema<"channels">[]}
}

interface RegisterMessage {
    args: {channel: number, text: string}
    retval: null
}

interface NewMessage {
    args: Shema<"messages">
    retval: null
}

import {Model} from "../interface/client-model"

export type Events = keyof SocketAPI
export type Args<T extends Events> = SocketAPI[T]["args"]
export type RetVal<T extends Events> = SocketAPI[T]["retval"]


interface SocketAPI {
    "init": Init
    "createChannel": CreateChannel
    "disconnect": {args: null, retval: null}
    "newChannel": NewChannel
    "getFirstMessageID": GetFirstMessageID
    "getMessagesBefore": GetMessagesBefore
    "getMessagesRecent": GetMessagesRecent
    "newMessage": NewMessage
    "registerMessage": RegisterMessage
    "userConnected": UserConnected
    "userDisconnected": UserDisconnected
    "userTyping": UserTyping
    "getUser": GetUser
}

interface Init {
    args: null
    retval: {
        channels: Model<"channel">[]
        currentUser: number
        online: number[]
        users: Model<"user">[]
    }
}

interface CreateChannel {
    args: {name: string, auto_join: boolean}
    retval: number | false
}

interface NewChannel {
    args: Model<"channel">
    retval: null
}

interface GetFirstMessageID {
    args: number
    retval: number
}

interface GetMessagesBefore {
    args: {channel: number, message: number}
    retval: Model<"message">[]
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

interface UserConnected {
    args: number
    retval: null
}

interface UserDisconnected extends UserConnected {}

interface GetUser {
    args: number
    retval: Model<"user">
}

interface UserTyping {
    args: {user: number, channel: number, typing: boolean}
    retval: null
}

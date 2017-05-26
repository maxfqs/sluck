type Auth = {login: string, password: string}
type ID = {id: number}
type Login = {login: string}
type Name = {name: string}

type UserID = {user: number}
type ChannelID = {channel: number}
type UserChannelsID = {user: number, channel: number}


export type Tables = keyof Database
export type Insert<T extends Tables> = Database[T]["insert"]
export type Select<T extends Tables> = Database[T]["select"]
export type Delete<T extends Tables> = Database[T]["delete"]
export type Shema<T extends Tables> = Database[T]["shema"]


export interface Database {
    "channels": Channels
    "users": Users
    "user-channels": UserChannels
}


interface Channels {
    insert: Name
    select: ID | Name
    delete: ID | Name
    shema: ChannelShema
}

interface UserChannels {
    insert: UserChannelsID
    select: UserID | ChannelID | UserChannelsID
    delete: UserID | ChannelID
    shema: UserChannelsShema
}

interface Users {
    insert: Auth
    select: ID | Auth | Login
    delete: ID | Auth
    shema: UserShema
}


interface BaseShema {
    /** Unique ID */
    readonly id: number
}

interface ChannelShema extends BaseShema {
    /** Channel's name (unique) */
    name: string
}

interface UserShema extends BaseShema {
    /** Username (unique) */
    login: string
    /** Password (encrypted) */
    password: string
}

interface UserChannelsShema extends BaseShema {
    /** User ID */
    user: number
    /** Channel ID */
    channel: number
}

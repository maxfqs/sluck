import * as knex from "knex"

interface KnexAnylator extends knex.QueryBuilder {
    select: any
    orderBy: any
    where: any
    andWhere: any
}

export interface QueryBuilder<T extends Tables> extends KnexAnylator {
    select: <K extends ShemaKey<T>> (...args: K[]) => this
    orderBy: (key: ShemaKey<T>, mode: "asc" | "desc") => this
    where: Where<T, ShemaKey<T>>
    andWhere: Where<T, ShemaKey<T>>
}

interface Where <T extends Tables, K extends ShemaKey<T>> {
    (arg: Partial<Shema<T>>): QueryBuilder<T>
    (key: K, ope: "<" | "=" | ">", val: Shema<T>[K]): QueryBuilder<T>
}


type Auth = {login: string, password: string}
type ID = {id: number}
type Login = {login: string}
type Name = {name: string}
type UserID = {user: number}
type ChannelID = {channel: number}
type UserChannelsID = {user: number, channel: number}
type InsertMessage = {user: number, channel: number, text: string, date: string}

export type Tables = keyof Database
export type Insert<T extends Tables> = Database[T]["insert"]
export type Delete<T extends Tables> = Database[T]["delete"]
export type Shema<T extends Tables> = Database[T]["shema"]
export type ShemaKey<T extends Tables> = keyof Database[T]["shema"]


export interface Database {
    "channels": Channels
    "messages": Messages
    "users": Users
    "user-channels": UserChannels
}


interface Channels {
    insert: Name
    delete: ID | Name
    shema: ChannelShema
}

interface Messages {
    insert: InsertMessage
    delete: ID | UserID | ChannelID
    shema: MessageShema
}

interface UserChannels {
    insert: UserChannelsID
    delete: UserID | ChannelID
    shema: UserChannelsShema
}

interface Users {
    insert: Auth
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

interface MessageShema extends BaseShema {
    /** User ID */
    user: number
    /** Channel ID */
    channel: number
    /** Message's content */
    text: string
    /** Date (unix) */
    date: string
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

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


export type Tables = keyof Database
export type Insert<T extends Tables> = Database[T]["insert"]
export type Shema<T extends Tables> = Database[T]["shema"]
export type ShemaKey<T extends Tables> = keyof Database[T]["shema"]


export interface Database {
    "channels": Channels
    "messages": Messages
    "users": Users
    "user-channels": UserChannels
}


interface Channels {
    insert: {name: string, auto_join?: boolean}
    shema: ChannelShema
}

interface Messages {
    insert: {user: number, channel: number, text: string, date: string}
    shema: MessageShema
}

interface UserChannels {
    insert: {user: number, channel: number}
    shema: UserChannelsShema
}

interface Users {
    insert: {login: string, password: string}
    shema: UserShema
}


interface BaseShema {
    /** Unique ID */
    readonly id: number
}

interface ChannelShema extends BaseShema {
    /** Channel's name (unique) */
    name: string
    /** Should user join automatically this channel */
    auto_join: boolean
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
    /** Avatar filename */
    avatar: string
}

interface UserChannelsShema extends BaseShema {
    /** User ID */
    user: number
    /** Channel ID */
    channel: number
}

type Auth = {login: string, password: string}
type ID = {id: number}
type Login = {login: string}


export type Tables = keyof Database
export type Insert<T extends Tables> = Database[T]["insert"]
export type Select<T extends Tables> = Database[T]["select"]
export type Delete<T extends Tables> = Database[T]["delete"]
export type Shema<T extends Tables> = Database[T]["shema"]


export interface Database {
    "users": Users
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

interface UserShema extends BaseShema {
    /** Username (unique) */
    login: string
    /** Password (encrypted) */
    password: string
}

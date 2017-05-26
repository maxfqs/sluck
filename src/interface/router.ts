import {Request} from "express"

/** Cookie session */
export interface Session {
    /** User ID */
    user: number
}

/** Sluck default request */
export interface Req extends Request {
    session: Session
}

/** Account post request */
export interface AccountPostReq extends Req {
    body: {login: string, password: string}
}

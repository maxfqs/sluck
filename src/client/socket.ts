import * as socketIO from "socket.io-client"
import {Args, Events, RetVal} from "../interface/socket-api"

declare const io: SocketIOClientStatic
const socket = io.connect("http://localhost:8080");


/** [ASYNC] Async implementation of the emit method */
export async function emit<T extends Events>(event: T, args: Args<T>) {
    return new Promise< RetVal<T> >( function(resolve, reject) {
        socket.emit(event, args, function(data) {
            resolve(data);
        })
    })
}

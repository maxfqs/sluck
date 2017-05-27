import {Socket} from "../interface/socket"
import {Args, Events, RetVal} from "../interface/socket-api"

declare const io
export const socket = <Socket>io.connect("http://localhost:8080");


/** [ASYNC] Async implementation of the emit method */
export async function emit<T extends Events>(event: T, args: Args<T>) {
    return new Promise< RetVal<T> >( function(resolve, reject) {
        socket.emit(event, args, function(data) {
            resolve(data);
        })
    })
}

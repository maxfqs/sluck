import {Server} from "http"
import * as socketIO from "socket.io"
import {Session} from "../interface/router"
import {Socket} from "../interface/socket"

const cookieParser = require("socket.io-cookie-parser")();
const decode = require("client-sessions").util.decode;
const secret = require("../../config/sluck.json").sessionSecret;


/** Init socket.io */
export function init(server: Server) {
    let io = socketIO(server);
    io.use(cookieParser);
    io.use(authorization);

    io.sockets.on("connection", initSocket);
}


/** Authorize the socket */
function authorization(socket: Socket, next) {
    let cookie = socket.request.cookies.session;
    let session: Session = decode({cookieName: "session", secret: secret}, cookie).content;

    if (session.user == null) {
        return next(new Error("not authorized"));
    }

    socket.userID = session.user;
    next();
}


/** Init socket */
function initSocket(socket: Socket) {

}

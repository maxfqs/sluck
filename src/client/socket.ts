import * as socketIO from "socket.io-client"

declare const io: SocketIOClientStatic
const socket = io.connect("http://localhost:8080");

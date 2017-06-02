import * as express from "express"
import * as http from "http"
import router from "./server/router"
import * as socket from "./server/socket"


const app = express();
const server = http.createServer(app);

app.set("view engine", "ejs");

app.use(express.static(__dirname + "./../public"));
app.use("/private", express.static(__dirname + "./../private"));
app.use(router);

server.listen(8080);
socket.init(server);

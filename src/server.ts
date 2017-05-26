import * as express from "express"
import * as http from "http"
import router from "./server/router"


const app = express();
const server = http.createServer(app);

app.set("view engine", "ejs");

app.use(express.static(__dirname + "./../public"));
app.use(router);

server.listen(8080);

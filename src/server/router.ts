import * as express from "express"
import * as user from "../server/user"
import {Req, AccountPostReq} from "../interface/router"


const bodyParser = require("body-parser");
const config = require("../../config/sluck.json");
const session = require("client-sessions");

const router = express.Router();
export default router;


router.use(session({
    cookieName: "session",
    secret: config.sessionSecret,
    duration: 60 * 60 * 1000 * 5, // 5 hours
    activeDuration: 60 * 60 * 1000 * 5 // 5 hours
}))

router.use(bodyParser.urlencoded({extended: true}));


router.get("/", async function(req: Req, res) {
    if (req.session.user == null) {
        return res.redirect("/login");
    }

    res.render("../views/index");
})

router.get("/login", accountGet);
router.get("/signup", accountGet);
router.post("/login", accountPost);
router.post("/signup", accountPost);

router.get("/logout", function(req: Req, res) {
    req.session.user = null;
    res.redirect("/login");
})


router.all("/private/*", function(req: Req, res, next) {
    if (req.session.user == null) {
        return res.send("");
    }
    next();
})


/** Get method for /login and /signup */
function accountGet(req: Req, res: express.Response) {
    let locals = {page: req.url, login: "", password: "", error: false};
    res.render("../views/account", locals);
}

/** [ASYNC] Post method for /login and /signup */
async function accountPost(req: AccountPostReq, res: express.Response) {
    let login = req.body.login;
    let password = req.body.password;

    if (login == null || password == null) {
        return res.status(400).send("Invalid request");
    }

    let page = req.url;
    let userID: number | false;

    if (page == "/login") {
        userID = await user.auth(login, password);
    } else if (page == "/signup") {
        userID = await user.create(login, password);
    }

    if (!userID) {
        let locals = {page: page, login: login, password: password, error: true};
        return res.render("../views/account", locals);
    }

    req.session.user = userID;
    res.redirect("/");
}

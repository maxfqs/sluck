import * as express from "express"

const router = express.Router();
export default router;

router.get("/", function(req, res) {
    res.render("../views/index");
})

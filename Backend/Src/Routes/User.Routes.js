import { Router } from "express";
import { Login, logout, Register } from "../Controller/User.Controller.js";
import { upload } from "../Middleware/Multer.js";
import { verifyJwt } from "../Middleware/Auth.js";
const router = Router();

router.post("/Register",upload.fields([
    {
        name : "avatar",
        maxCount:1
    }
]),Register)

router.route("/login").post(Login)
router.route("/logout").post(verifyJwt,logout)

export default router;
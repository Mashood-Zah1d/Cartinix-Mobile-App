import { Router } from "express";
import { getProductDetail, getProducts } from "../Controller/Product.Controller.js";
import { upload } from "../Middleware/Multer.js";
import { verifyJwt } from "../Middleware/Auth.js";
const router = Router();

router.route("/productDetail").get(verifyJwt,getProducts)
router.route("/:id").get(verifyJwt,getProductDetail)

export default router;
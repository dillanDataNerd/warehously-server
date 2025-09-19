const router = require("express").Router();

// Used for waking up the server when idle
router.get("/", (req, res, next) => {
  console.log("connected")
  res.json("Server running, all good");
});

const userRouter= require("./users.routes")
router.use("/users",userRouter)

const authRouter=require("./auth.routes")
router.use("/auth",authRouter)

const orderRouter=require("./orders.routes")
router.use("/orders",orderRouter)

const inventoryRouter=require("./inventory.routes")
router.use("/inventory",inventoryRouter)

const orderLinesRouter=require("./orderLines.routes")
router.use("/orderLines",orderLinesRouter)

//cloudinary routes
const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);


module.exports = router;
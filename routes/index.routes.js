const router = require("express").Router();

// ℹ️ Test Route. Can be left and used for waking up the server if idle
router.get("/", (req, res, next) => {
  console.log("connected")
  res.json("Connected to database");
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

module.exports = router;
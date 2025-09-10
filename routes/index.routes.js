const router = require("express").Router();

// ℹ️ Test Route. Can be left and used for waking up the server if idle
router.get("/", (req, res, next) => {
  console.log("connected")
  res.json("Connected to database");
});

const userRouter= require("./users.routes")
router.use("/users",userRouter)


module.exports = router;

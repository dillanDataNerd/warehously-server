const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const User = require("../models/User.model")

// GET /users
router.get("/", async (req,res,next)=>{
  const response= await User.find()
  res.json(response.body)
})

// POST /users/signup - Creates a new user in the database
router.post("/signup", async (req, res, next) => {
  console.log(req.body)
  const { email, password, firstName, lastName } = req.body[0];

  console.log("email:" + email)

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser !== null) {
      res.json({
        errorMessage: "There is a user already registered with that email",
      });

      return;
    }

    // const hashPassword= await bcrypt.hash (password, 12)

    await User.create ({
        email,
        firstName,
        lastName,
        password,
    })
    res.sendStatus(201)

  } catch (error) {
    //console.log(error);
    //res.json(error)
    //next(error);
  }
});

module.exports = router
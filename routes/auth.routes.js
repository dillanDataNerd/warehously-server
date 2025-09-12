const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const User = require("../models/User.model");
const validateToken = require("../middleware/auth.middleware");


// POST api/auth/login - Verify credentials and send token
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // validate inputs
  if (!email || !password) {
    res
      .status(400)
      .json({
        errorMessage: "email and password are mandatory",
      });
    return;
  }

  //find and authenticate user
  try {
    const foundUser = await User.findOne({ email });
    if (foundUser === null) {
      res.status(401).json({
        errorMessage: "There is no user registered with that email.",
      });

      return;
    }

    const isPasswordCorrect=await bcrypt.compare(password,foundUser.password)

    if(isPasswordCorrect === false){
        res.status(400).json({errorMessage:"the password is incorrect for this user"})
        return 
    }

    // send back auth token
    const payLoad ={
        _id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role
    }

    const authToken = jwt.sign(payLoad, `${process.env.TOKEN_SECRET_KEY}`, { algorithm: "HS256", expiresIn: "10d"})

    res.status(202).json({ payLoad, authToken });
  } 
  
  catch (error) {
    console.log(error)
    next(error);
  }
});

//GET api/auth/verify
router.get('/verify', validateToken, (req, res, next) => {  
 
  console.log(`req.payload`, req.payload);
 
  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

//DELETE THIS TEST
//GET // api/validation-test
router.get("/validation-test",validateToken, async (req, res, next) => {
try {
    const response = await User.find({});
    res.json(response);
    console.log("user verified");
  } catch (error) {
    res.json({errorMessage:"invalid token"});
    console.log("invalid token");
  }
});

module.exports = router;

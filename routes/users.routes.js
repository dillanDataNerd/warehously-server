const express = require("express");
const router = express.Router();
const { isValidObjectId } = require("mongoose");


const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

// GET api/users
router.get("/", async (req, res, next) => {
  try {
    const response = await User.find({});
    res.json(response);
  } catch (error) {
    next();
  }
});

// POST api/users/signup - Creates a new user in the database
router.post("/signup", async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  // validate inputs
  if (!email || !password || !firstName || !lastName) {
    res
      .status(400)
      .json({
        errorMessage: "first name, last name, email and password are mandatory",
      });
    return;
  }

  //validate password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (passwordRegex.test(password) === false) {
    res
      .status(400)
      .json({
        errorMessage:
          "Password is not strong enough. It needs at least 8 characters. It also needs 1 lower case character, 1 upper case character and a digit",
      });
    return;
  }

  //validate user is unique
  try {
    const foundUser = await User.findOne({ email });
    if (foundUser !== null) {
      res.json({
        errorMessage: "There is a user already registered with that email",
      });

      return;
    }

    const hashPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      firstName,
      lastName,
      password: hashPassword,
    });
    res.sendStatus(201);
  } catch (error) {
    res.json(error);
    next(error);
  }
});
//PATCH // api/users/:userId
router.patch("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const role = req.body[0].role; 

    if (role === undefined) {
      return res.status(400).json({ errorMessage: "role is missing" });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ errorMessage: "invalid user id" });
    }

    const response = await User.findByIdAndUpdate(
      userId,
      { role } ,
      { new: true, runValidators: true }
    );

    if (!response) {
      return res.status(404).json({ errorMessage: "There is no user registered to this id" });
    }

    return res.status(200).json({ data: response });
  } catch (err) {
    return next(err); 
  }
});

module.exports = router;

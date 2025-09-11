const express = require("express");
const router = express.Router();
const Order = require("../models/Order.model");
const validateToken = require("../middleware/auth.middleware");

// GET api/orders
router.get("/", validateToken, async (req, res, next) => {
  try {
    const response = await Order.find({});
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//GET api/orders/:orderId
router.get("/:orderId", validateToken, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    response = await Order.findById(orderId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//POST api/orders/new

router.post("/new", validateToken, async (req, res, next) => {
  try {
    console.log(req.body);
    const { customerName, createdBy, totalAmount, deliveryDate, status } =
      req.body;
    const response = await Order.create({
      customerName,
      createdBy,
      totalAmount,
      deliveryDate,
      status,
    });
    res.status(201).json({ data: response });
  } catch (error) {
    next(error);
  }
});

//PUT api/order/:orderId
router.patch("/:orderId", validateToken, async (req, res, next) => {
  const orderId = req.params.orderId;
  const { customerName, deliveryDate, status } = req.body;

    const update = {};
    if (customerName) update.customerName = customerName;
    if (deliveryDate) update.deliveryDate = deliveryDate;
    if (status) update.status = status;

  try {
    response = await Order.findByIdAndUpdate(
      orderId,
      { $set:update },
      { new: true, runValidators: true }
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//DELETE api/order/:orderId
router.delete("/:orderId", validateToken, async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    response = await Order.findByIdAndDelete(orderId);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});


module.exports = router;

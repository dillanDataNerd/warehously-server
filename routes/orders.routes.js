const express = require("express");
const router = express.Router();
const Order = require("../models/Order.model");
const OrderLine = require("../models/OrderLine.model")
const Inventory = require ("../models/Inventory.model")
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
  const { orderId } = req.params;

  try {
    // 1) Get all order lines
    const lines = await OrderLine.find({ order: orderId });

    // 2) For each order line, restore availableQty
    for (const line of lines) {

      await Inventory.updateOne(
        { _id: line.inventory },
        { $inc: { availableQty: line.quantity } }
      );
    }

    // 3) Delete order lines
    await OrderLine.deleteMany({ order: orderId });

    // 4) Delete the order
    await Order.findByIdAndDelete(orderId);

    return res
      .status(200)
      .json({ message: "Order deleted and inventory restored." });
  } catch (error) {
    return next(error);
  }
});
;


module.exports = router;

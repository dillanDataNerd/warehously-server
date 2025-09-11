const express = require("express");
const router = express.Router();
const OrderLine = require("../models/OrderLine.model");
const Order = require("../models/Order.model");
const Inventory = require("../models/Inventory.model");
const validateToken = require("../middleware/auth.middleware");
const {
  validateOrderLinesRequest,
  updateInventory,
  validateOrderLinesReferences,
} = require("../middleware/orderLines.middleware");

// GET api/ordersLines
router.get("/", validateToken, async (req, res, next) => {
  try {
    const response = await OrderLine.find({});
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//GET api/ordersLines/:orderLineId
router.get("/:orderLineId", validateToken, async (req, res, next) => {
  try {
    const orderLineId = req.params.orderLineId;
    response = await OrderLine.findById(orderLineId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//POST api/orders/new

router.post(
  "/new",
  validateToken,
  validateOrderLinesRequest,
  validateOrderLinesReferences,
  updateInventory,
  async (req, res, next) => {
    try {
      const { quantity, priceEach, order, inventory } = req.body;
      const totalAmount = quantity * priceEach;

      if (!quantity || !order || !inventory || !priceEach) {
        return res
          .status(400)
          .json({
            error: "quantity, order, priceEach and inventory are required",
          });
      }

      const response = await OrderLine.create({
        quantity,
        priceEach,
        order,
        inventory,
        totalAmount,
      });
      res.status(201).json({ data: response });
    } catch (error) {
      next(error);
    }
  }
);

//PATCH api/order/:orderLineId
router.patch(
  "/:orderLineId",
  validateToken,
  validateOrderLinesRequest,
  validateOrderLinesReferences,
  updateInventory,
  async (req, res, next) => {
    const orderLineId = req.params.orderLineId;
    const { inventory, priceEach, quantity } = req.body;

    const update = {};
    if (inventory) update.inventory = inventory;
    if (priceEach) update.priceEach = priceEach;
    if (quantity) update.quantity = quantity;

    try {
      const response = await OrderLine.findByIdAndUpdate(
        orderLineId,
        { $set: update },
        { new: true }
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

//DELETE api/order/:orderLineId
router.delete("/:orderLineId", validateToken, async (req, res, next) => {
  const orderLineId = req.params.orderLineId;

  try {
    response = await OrderLine.findByIdAndDelete(orderLineId);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const OrderLine = require("../models/OrderLine.model");
const Order = require("../models/Order.model");
const Inventory = require("../models/Inventory.model");
const validateToken = require("../middleware/auth.middleware");
const { Types } = require("mongoose");

const {
  validateOrderLinesRequest,
  updateInventory,
  validateOrderReference,
  validateInventoryReference,
  updateInventoryFromDeletedOrderLine
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
    response = await OrderLine.findById(orderLineId)
    .populate("inventory")
    .populate("order");
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//GET api/ordersLines/order/:orderId
router.get(
  "/order/:orderId",
  validateToken,
  validateOrderReference,
  async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      const response = await OrderLine.find({
        order: new Types.ObjectId(orderId),
      }).populate("inventory");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

//GET api/ordersLines/inventory/:inventoryId
router.get(
  "/inventory/:inventoryId",
  validateToken,
  validateInventoryReference,
  async (req, res, next) => {
    try {
      const inventoryId = req.params.inventoryId;
      const response = await OrderLine.find({
        inventory: new Types.ObjectId(inventoryId),
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

//POST api/orders/new

router.post(
  "/new",
  validateToken,
  validateOrderLinesRequest,
  updateInventory,
  validateOrderReference,
  validateInventoryReference,

  async (req, res, next) => {
    try {
      const { quantity, priceEach, order, inventory } = req.body;
      const totalAmount = quantity * priceEach;

      if (!quantity || !order || !inventory || !priceEach) {
        return res.status(400).json({
          error: "quantity, priceEach and inventory are required",
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
  validateOrderReference,
  validateInventoryReference,
  updateInventory,
  async (req, res, next) => {
    const orderLineId = req.params.orderLineId;
    const { priceEach, quantity } = req.body;

console.log(req.body)

    const update = {};
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

//DELETE api/orderLines/:orderLineId
router.delete(
  "/:orderLineId",
  validateToken,
  updateInventoryFromDeletedOrderLine,
  async (req, res, next) => {
    const orderLineId = req.params.orderLineId;

    try {
      response = await OrderLine.findByIdAndDelete(orderLineId);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

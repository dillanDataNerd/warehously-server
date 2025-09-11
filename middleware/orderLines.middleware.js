const Order = require("../models/Order.model");
const Inventory = require("../models/Inventory.model");
const mongoose = require("mongoose");
const OrderLine = require("../models/OrderLine.model");

// ensure that orderline makes sense
async function validateOrderLinesRequest(req, res, next) {
  const { quantity, priceEach } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ error: "quantity must be at least 1" });
  }
  if (priceEach < 0) {
    return res.status(400).json({ error: "quantity must be at least 1" });
  }
  next();
}

// check that that orderlines are linked to real objects if the client sends and id
async function validateOrderLinesReferences(req, res, next) {
  const { order, inventory } = req.body;

  try {
    if (!order) {
      next();
    } else {
      const foundOrder = await Order.findOne({ _id: order });
      if (!foundOrder) {
        return res
          .status(400)
          .json({ errorMessage: "order not found in database" });
      }
    }

    if (!inventory) {
      next();
    } else {
      const foundInventory = await Inventory.findOne({ _id: inventory });
      if (!foundInventory) {
        return res
          .status(400)
          .json({ errorMessage: "Inventory not found in database" });
      }

      next();
    }
  } catch (error) {
    next(error);
  }
}

async function updateInventory(req, res, next) {
  //get all available quantity data
  const orderLineId = req.params.orderLineId;
  const { quantity, inventory } = req.body;

  //only continue is there is a quantity change
  if (!quantity) {
    return;
  }

  // Set order lines quantity to 0 incase this is attached to a new order. If we find an associated orderLine, we update the order accordingly
  let currentOrderLineQuantity = 0;
  try {
    let response = await OrderLine.findById(orderLineId);
    currentOrderLineQuantity = response.quantity;
  } catch (error) {}

  let currentAvailableInventory = null;
  let stockedInventory = null;
  try {
    let response = await Inventory.findById(inventory);
    currentAvailableInventory = response.availableQty;
    stockedInventory = response.stockedQty;
  } catch (error) {
    next(error);
  }

  //check that the order line update won't reduce avilable quantity to negative. If its fine, update inventory
  const updatedAvailableInventory =
    currentAvailableInventory - (quantity - currentOrderLineQuantity);

  if (updatedAvailableInventory < 0) {
    return res.status(400).json({
      errorMessage: "Not enough available inventory to make this change",
    });
  } else if (updatedAvailableInventory > stockedInventory) {
    return res.status(400).json({
      errorMessage:
        "You can not have more available inventory than is in stock",
    });
  } else {
    try {
      await Inventory.findByIdAndUpdate(
        inventory,
        { availableQty: updatedAvailableInventory },
        { new: true }
      );
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  validateOrderLinesRequest,
  updateInventory,
  validateOrderLinesReferences,
};

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
// Middleware to validate order reference (only if provided)
async function validateOrderReference(req, res, next) {
  const { order } = req.body;

  try {
    if (!order) {
      return next(); // no order in request → skip
    }

    const foundOrder = await Order.findById(order);
    if (!foundOrder) {
      return res.status(400).json({ errorMessage: "order not found in database" });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

// Middleware to validate inventory reference (only if provided)
async function validateInventoryReference(req, res, next) {
  const { inventory } = req.body;

  try {
    if (!inventory) {
      return next(); // no inventory in request → skip
    }

    const foundInventory = await Inventory.findById(inventory);
    if (!foundInventory) {
      return res.status(400).json({ errorMessage: "Inventory not found in database" });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}


async function updateInventory(req, res, next) {
  //get all available quantity data
  const orderLineId = req.params.orderLineId;
  const { quantity, inventory } = req.body;

  //only continue is there is a quantity change
  if (quantity) {

  // Set order lines quantity to 0 incase this is attached to a new order. If we find an associated orderLine, we update the order accordingly
  let currentOrderLineQuantity = 0;
  try {
    let response = await OrderLine.findById(orderLineId);
    currentOrderLineQuantity = response.quantity;
    console.log("current order line quantity: " + currentOrderLineQuantity)
  } catch (error) {}

  let currentAvailableInventory = null;
  let stockedInventory = null;

  try {
    console.log(inventory)
    let response = await Inventory.findById(inventory);
    console.log("available quantity" + response)
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
    console.log(`Updated inventory = ${updatedAvailableInventory} stockedInventory=${stockedInventory}`)
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
}else{
  next()
}
}

// whenever orderlines are deleted it should add the inventory back to the avaiable stock
async function updateInventoryFromDeletedOrderLine(req,res,next){
    //get orderLine quantity
  const orderLineId = req.params.orderLineId;
  let orderLineQuantity= null
  let inventoryId=null
    try {
    let response = await OrderLine.findById(orderLineId);
    orderLineQuantity = response.quantity;
    inventoryId=response.inventory
  } catch (error) {next(error)}

// add deleted order line quantity back to original inventory

  try {
      await Inventory.findByIdAndUpdate(
        inventoryId,
        { $inc:{availableQty: orderLineQuantity }},
        { new: true }
      );
      next();
    } catch (error) {
      next(error);
    }

}

module.exports = {
  validateOrderLinesRequest,
  updateInventory,
  validateOrderReference, 
  validateInventoryReference,
  updateInventoryFromDeletedOrderLine
};

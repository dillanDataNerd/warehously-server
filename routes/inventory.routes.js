const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory.model");
const validateToken = require("../middleware/auth.middleware");

// GET api/orders
router.get("/", validateToken, async (req, res, next) => {
  try {
    const response = await Inventory.find({});
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//GET api/orders/:inventoryId
router.get("/:inventoryId", validateToken, async (req, res, next) => {
  try {
    const inventoryId = req.params.inventoryId;
    response = await Inventory.findById(inventoryId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//POST api/orders/new

router.post("/new", validateToken, async (req, res, next) => {
  try {
    console.log(req.body);

    const {
      sku,
      title,
      description,
      imageUrl,
      recommendedPrice,
      cost,
      stockedQty,
      availableQty,
      location,
    } = req.body;

    const response = await Inventory.create({
      sku,
      title,
      description,
      imageUrl,
      recommendedPrice,
      cost,
      stockedQty,
      availableQty,
      location,
    });

    res.status(201).json({ data: response });
  } catch (error) {
    next(error);
  }
})

//Patch api/order/:inventoryId
router.patch("/:inventoryId", validateToken, async (req, res, next) => {
  const inventoryId = req.params.inventoryId;
  const {
    sku,
    title,
    description,
    imageUrl,
    recommendedPrice,
    cost,
    stockedQty,
    availableQty,
    location,
  } = req.body;

  const update = {};
  if (sku) update.sku = sku;
  if (title) update.title = title;
  if (description) update.description = description;
  if (imageUrl) update.imageUrl = imageUrl;
  if (recommendedPrice !== undefined) update.recommendedPrice = recommendedPrice;
  if (cost !== undefined) update.cost = cost;
  if (stockedQty !== undefined) update.stockedQty = stockedQty;
  if (availableQty !== undefined) update.availableQty = availableQty;
  if (location) update.location = location;

  try {
    const response = await Inventory.findByIdAndUpdate(
      inventoryId,
      { $set: update },
      { new: true, runValidators: true }
    );
    res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
});
//DELETE api/inventory/:inventoryId
router.delete("/:inventoryId", validateToken, async (req, res, next) => {
  const inventoryId = req.params.inventoryId;

  try {
    const response = await Inventory.findByIdAndDelete(inventoryId);
    if (!response) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json({ data: response });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

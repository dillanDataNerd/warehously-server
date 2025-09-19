const { Schema, model } = require("mongoose");

const inventorySchema = new Schema(
  {
    sku: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    recommendedPrice: { type: Number, min: 0 },
    cost: { type: Number, min: 0 },
    stockedQty: { type: Number, min: 0 },
    availableQty: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.stockedQty;
        },
        message: `Available quantity cannot exceed stocked quantity`
      },
    },
    location: { type: String },
  },
  { timestamps: true }
);

const Inventory = model("Inventory", inventorySchema);

module.exports = Inventory;

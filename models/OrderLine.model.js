const { Schema, model } = require("mongoose");

const orderLineSchema = new Schema(
  {
    quantity: { type: Number, min: 0, require: true },
    priceEach: { type: Number, min: 0, require: true },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    inventory: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
    },
    totalAmount: { type: Number }
  },
  { timestamps: true }
);

const OrderLine = model("OrderLine", orderLineSchema);

module.exports = OrderLine;

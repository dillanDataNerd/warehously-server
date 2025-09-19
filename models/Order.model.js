const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    customerName: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    totalAmount: { type: Number, default: 0 },
    deliveryDate: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ["draft", "ready to pick", "picking", "ready to ship", "shipped"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;

//todo: Update the total amount automatically after the use adds orderline
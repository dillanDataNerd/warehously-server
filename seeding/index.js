const inventory = require("./warehousely-database.inventories.json");
const orders = require("./warehousely-database.orders.json");
const InventoryModel = require("../models/Inventory.model");
const OrderModel = require("../models/Order.model");
const mongoose = require("mongoose");
process.loadEnvFile()

async function seedDatabase() {
  try {
    // ℹ️ Connects to MongoDB using the URI from environment variables.
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to db")
    await InventoryModel.insertMany(inventory)
    console.log("inventory added" )
    await OrderModel.insertMany(orders)
    console.log("orders added" )
       
    await mongoose.connection.close();

  } catch (error) {
    console.log(error);
  }
}

seedDatabase()
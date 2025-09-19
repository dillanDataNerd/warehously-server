const OrderLine = require("../models/OrderLine.model");

// ensure that inventory have no open orders associated to them before deletion. This ensures the database is properly connected
async function validateNoOpenOrderlines(req, res, next) {
  const inventory = req.params.inventoryId;

  try {
    const orderLine = await OrderLine.findOne({ inventory });
    if (orderLine) {
      return res
        .status(409)
        .json({
          error:
          "Cannot delete inventory: there are order lines referencing this item. Delete those first.",
        });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = validateNoOpenOrderlines;
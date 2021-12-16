const session = require("express-session");
const Ordered = require("../moders/order.model");
const validation = require("../validation/validation");

exports.orderedDetail = async function (req, res) {
  const order_id = req.query.order_id;
  const dataRow = await Ordered.getOrderById(order_id);
  const order = dataRow[0];
  order.total_amount = validation.formatPrice(order.total_amount);
  order.order_date = validation.formatDate(order.order_date);
  order.isPending = order.status === "pending";
  order.isSuccess = order.status === "success";
  const items = await Ordered.getAllItemByOrderId(order_id);
  items.forEach((item) => {
    // format price
    item.old_price = validation.formatPrice(item.price);
    let present_price = Math.ceil(item.price - (item.price * item.sale) / 100);
    item.present_price = validation.formatPrice(present_price);
  });
  console.log(items);
  res.render("orderedDetail", {
    layout: false,
    order_id: order_id,
    userSession: session.userSession,
    order: order,
    items: items,
  });
};

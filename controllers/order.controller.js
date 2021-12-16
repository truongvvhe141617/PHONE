const session = require("express-session");
const Order = require("../moders/order.model");
const Item = require("../moders/item.model");
const validation = require("../validation/validation");
const User = require("../moders/user.model");

exports.get = async function (req, res) {
  let userSession = session.userSession;
  try {
    let orders = await Order.getAllByUser(userSession.email);
    for (order of orders) {
      order.total_amount = validation.formatPrice(order.total_amount);
      order.order_date = validation.formatDate(order.order_date);
      order.isPending = order.status === "pending";
      order.isSuccess = order.status === "success";
      let dataRow = await Item.countItemIOrder(order.order_id);
      order.totalItem = dataRow;
      order.isOnlyOneItem = order.totalItem === 1;
    }

    res.render("order", {
      layout: false,
      orders: orders,
      userSession: userSession,
    });
  } catch {
    res.render("login", {
      layout: false,
    });
  }
};

exports.post = async function (req, res) {
  // get information of user
  const user = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  };

  // check user does exist in database
  try {
    const dataRow = await User.getUserByEmail(user.email);
    let UserByEmail = dataRow[0];
    if (!UserByEmail) {
      //if email does not exist => add new user
      await User.addNewUser(user);
    }
  } catch (err) {
    res.render("login");
  }

  let cart_list = req.session.cart_list || [];
  let total_amount_ordered = 0;
  cart_list.forEach((item) => {
    total_amount_ordered += Math.ceil(
      item.price * item.order_quantity -
        (item.price * item.order_quantity * item.sale) / 100
    );
  });
  //get current date
  let today = new Date();
  // add order
  let order = {
    order_date: today,
    status: "pending",
    total_amount: total_amount_ordered,
    email: user.email,
    address: user.address,
    phone: user.phone,
    full_name: user.full_name,
  };
  await Order.add(order);
  // get order id of last inserted
  let orderId = await Order.getOrderIdLastInserted();
  // add item of order
  for (let item of cart_list) {
    let newItem = {
      product_detail_id: item.product_detail_id,
      quantity: item.order_quantity,
      order_id: orderId,
    };
    await Item.add(newItem);
  }
  // delete session of cart
  req.session.cart_list = null;
  session.userSession = user;
  res.redirect("order");
};

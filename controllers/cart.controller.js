const session = require("express-session");
const Product = require("../moders/product.model");
const validation = require("../validation/validation");

// add item to cart
exports.cart = async function (req, res) {
  let cart_list = req.session.cart_list || [];
  let total_order_quantity = 0;
  let total_amount_ordered = 0;
  cart_list.forEach((item) => {
    // if item has sale => isSale = true
    if (item.sale != 0) {
      item.isSale = true;
    }
    // format price
    item.old_price = validation.formatPrice(item.price);
    let present_price = Math.ceil(item.price - (item.price * item.sale) / 100);
    item.present_price = validation.formatPrice(present_price);

    total_amount_ordered += Math.ceil(
      item.price * item.order_quantity -
        (item.price * item.order_quantity * item.sale) / 100
    );
  });
  // format total_amout_ordered
  total_amount_ordered = validation.formatPrice(total_amount_ordered);
  res.render("cart", {
    layout: false,
    cart_list: cart_list,
    cartEmpty: cart_list.length === 0,
    total_amount_ordered: total_amount_ordered,
  });
};

// add item to cart
exports.addToCart = async function (req, res) {
  let cart_list = req.session.cart_list || [];
  let product_detail_id = req.body.product_detail_id;
  let quantity = parseInt(req.body.quantity);
  // get item detail by id
  let dataRow = await Product.findProductDetailById(product_detail_id);
  let item = dataRow[0];

  cart_list.forEach((item) => {
    if (item.product_detail_id === product_detail_id) {
      item.order_quantity += quantity;
      req.session.cart_list = cart_list;
      res.redirect("cart");
    }
  });

  item.order_quantity = quantity;
  // add item to cart
  cart_list.push(item);
  req.session.cart_list = cart_list;
  res.redirect("cart");
};

// delete item from cart
exports.deleteFromCart = async (req, res) => {
  let cart_list = req.session.cart_list || [];
  let product_detail_id = req.query.product_detail_id;
  // find index of item
  var index = cart_list.findIndex(function (item) {
    return item.product_detail_id === product_detail_id;
  });
  // delete item
  if (index !== -1) cart_list.splice(index, 1);

  session.cart_list = cart_list;
  res.redirect("cart");
};

// update quantity of item in cart
exports.updateQuantity = async (req, res) => {
  let product_detail_id = req.query.product_detail_id;
  let select = req.query.select;
  let cart_list = req.session.cart_list;
  cart_list.forEach((item) => {
    if (item.product_detail_id === product_detail_id) {
      if (select === "plus") {
        item.order_quantity += 1;
      } else if (select === "minus") {
        if (item.order_quantity > 1) {
          item.order_quantity -= 1;
        }
      }
    }
  });
  req.session.cart_list = cart_list;
  res.redirect("cart");
};

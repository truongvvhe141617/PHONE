const Product = require("../moders/product.model");
const Category = require("../moders/category.model");
const session = require("express-session");

// return home page
exports.fillter = async function (req, res) {
  // get category id, isSale, isNew, isCredit, isMonopoly from request (fillters)
  let category_id = req.query.category_id || req.session.category_id || "";
  let isSale = req.query.isSale || req.session.isSale || "false";
  let isCredit = req.query.isCredit || req.session.isCredit || "false";
  let isMonopoly = req.query.isMonopoly || req.session.isMonopoly || "false";
  let isNew = req.query.isNew || req.session.isNew || "false";

  // set session for each properties of fillter
  req.session.category_id = category_id;
  req.session.isSale = isSale;
  req.session.isCredit = isCredit;
  req.session.isMonopoly = isMonopoly;
  req.session.isNew = isNew;

  // get all phones from category in database
  const categories = await Category.findAll();

  // get all products from database by category id
  const products = await Product.findAllByCategory(
    category_id,
    isSale,
    isCredit,
    isMonopoly,
    isNew
  );

  // count total product and get name of category (example: iPhone(Apple))
  const product = {
    totalProduct: products.length,
  };

  // set isActive for categories and get category name
  for (const c of categories) {
    if (c.category_id === category_id) {
      c.isActive = true;
      product.name = c.category_name;
    }
  }
  // set sale, and format price for each product
  for (const p of products) {
    // if product has sale => isSale = true
    if (p.sale != 0) {
      p.isSale = true;
    }
    // format price
    if (parseInt(p.price % 1000) >= parseInt(100)) {
      p.old_price = parseInt(p.price / 1000) + "." + (p.price % 1000);
    } else {
      p.old_price = parseInt(p.price / 1000) + ".0" + (p.price % 1000);
    }
    if (
      parseInt(Math.ceil(p.price - (p.price * p.sale) / 100) % 1000) >=
      parseInt(100)
    ) {
      p.present_price =
        parseInt(Math.ceil(p.price - (p.price * p.sale) / 100) / 1000) +
        "." +
        (Math.ceil(p.price - (p.price * p.sale) / 100) % 1000);
    } else {
      p.present_price =
        parseInt(Math.ceil(p.price - (p.price * p.sale) / 100) / 1000) +
        ".0" +
        (Math.ceil(p.price - (p.price * p.sale) / 100) % 1000);
    }
  }

  res.render("home", {
    products: products,
    isEmpty: products.length === 0,
    categories: categories,
    product: product,
    isSale: isSale === "true",
    isCredit: isCredit === "true",
    isMonopoly: isMonopoly === "true",
    isNew: isNew === "true",
  });
};

const Product = require("../moders/product.model");
const validation = require("../validation/validation");

// return product detail page
exports.detail = async function (req, res) {
  // get product_detail_id, product_id, version, color from request
  const product_detail_id = req.query.product_detail_id;
  const product_id = req.query.product_id;
  const version = req.query.version;
  const color = req.query.color;

  // get data when select product detail by id
  const dataRow = await Product.findProductDetail(product_id, version, color);
  // assign data to product detail at dataRow[0]
  const product = dataRow[0];
  // if product has sale => isSale = true
  if (product.sale != 0) {
    product.isSale = true;
  }
  // format price
  product.old_price = validation.formatPrice(product.price);
  let present_price = Math.ceil(
    product.price - (product.price * product.sale) / 100
  );
  product.present_price = validation.formatPrice(present_price);

  let present_version = undefined;
  let present_color = undefined;
  // get all version of product
  const versions = await Product.findAllVersion(product.product_id);
  // set isActive of version and set id for product = present id => return views
  for (const v of versions) {
    if (v.version === product.version) {
      v.isActive = true;
      present_version = v.version;
    }
  }

  // get all product by id distinct by color
  const colors = await Product.findAllColor(product.product_id);
  // set isActive for product that has selected
  for (const c of colors) {
    if (c.color === product.color) {
      c.isActive = true;
      present_color = c.color;
    }
    c.version = present_version;
  }

  for (const v of versions) {
    v.color = present_color;
  }

  res.render("product_detail", {
    layout: false,
    product: product,
    versions: versions,
    colors: colors,
  });
};

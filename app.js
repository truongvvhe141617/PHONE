const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);
app.use(express.static("public"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// res local
app.use(async function (req, res, next) {
  // get all phones from category in database
  let cart_list = req.session.cart_list || [];
  let isCartEmpty = cart_list.length === 0;
  res.locals.isCartEmpty = isCartEmpty;
  let total_order_quantity = 0;
  cart_list.forEach((item) => {
    total_order_quantity += item.order_quantity;
  });
  res.locals.total_order_quantity = total_order_quantity;
  let isAuthenticated = false;
  if (session.userSession) {
    res.locals.lcIsAuthenticated = true;
    res.locals.lcUserSessison = session.userSession;
  }

  next();
});

app.get("/", function (req, res) {
  res.redirect("home");
});

// call router: home router
const homeRouter = require("./routers/home.router");
app.use("/home", homeRouter);

// call router: product router
const productRouter = require("./routers/product.router");
app.use("/product-detail", productRouter);

// call router: fillter router
const fillterRouter = require("./routers/fillter.router");
app.use("/fillter", fillterRouter);

// call router: cart router
const cartRouter = require("./routers/cart.router");
app.use("/cart", cartRouter);

// call router: detele cart item router
const deteleCartItemRouter = require("./routers/deleteCartItem.router");
app.use("/detele-cart-item", deteleCartItemRouter);

// call router: update cart item router
const updateCartItemRouter = require("./routers/updateCartItem.router");
app.use("/update-cart-item", updateCartItemRouter);

// call router: update cart item router
const orderRouter = require("./routers/order.router");
app.use("/order", orderRouter);

// call router: profile router
const profileRouter = require("./routers/profile.router");
app.use("/profile", profileRouter);

// call router: logout router
const logoutRouter = require("./routers/logout.router");
app.use("/logout", logoutRouter);

// call router: goToOrdered router
const goToOrderedRouter = require("./routers/goToOrdered.router");
app.use("/goToOrdered", goToOrderedRouter);

// call router: login router
const loginRouter = require("./routers/login.router");
app.use("/login", loginRouter);

// call router: verifyEmail router
const verifyEmailRouter = require("./routers/verifyEmail.router");
app.use("/verifyEmail", verifyEmailRouter);

// call router: orderedDetail router
const orderedDetailRouter = require("./routers/orderedDetail.router");
app.use("/orderedDetail", orderedDetailRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("http://localhost:8000/home");
});

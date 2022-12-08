const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      res.render("shop/product-detail", {
        product: products[0],
        pageTitle: products[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.findAll()
    .then((cart) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cart,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findAll({ where: { id: prodId } })
    .then(([product]) => {
      Cart.findAll({ where: { id: prodId } }).then((cartProduct) => {
        if (cartProduct.length > 0) {
          cartProduct[0].id = prodId;
          cartProduct[0].price = cartProduct[0].price + product.price;
          cartProduct[0].save();
          res.redirect("/cart");
        } else {
          Cart.create({
            id: prodId,
            price: product.price,
            title: product.title,
            imageUrl: product.imageUrl,
            description: product.description,
          })
            .then(() => {
              res.redirect("/cart");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.findById(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Cart.findAll({ where: { id: prodId } })
    .then(([product]) => {
      return product.destroy();
    })
    .then(() => {
      console.log("deleted");
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

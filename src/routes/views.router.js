const { Router } = require("express");
const ProductManager = require("../dao/ProductManager");
const CartManager = require("../dao/CartManager");

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", (req, res) => {
  res.redirect("/products");
});

router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const productData = await productManager.getProducts({
      limit,
      page,
      sort,
      query,
    });

    res.render("products", {
      products: productData.docs,
      totalPages: productData.totalPages,
      page: productData.page,
      hasPrevPage: productData.hasPrevPage,
      hasNextPage: productData.hasNextPage,
      prevLink: productData.hasPrevPage
        ? `/products?page=${productData.prevPage}`
        : null,
      nextLink: productData.hasNextPage
        ? `/products?page=${productData.nextPage}`
        : null,
    });
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (cart) {
      res.render("cart", { products: cart.products });
    } else {
      res.status(404).send("Carrito no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts({});
  res.render("realTimeProducts", { products: products.docs });
});

module.exports = router;

const { Router } = require("express");
const CartManager = require("../dao/CartManager");

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (cart) {
    res.json(cart);
  } else {
    res
      .status(404)
      .json({ message: "no se han encontrado productos en el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const result = await cartManager.addProductToCart(
    req.params.cid,
    req.params.pid
  );
  if (result.success) {
    res.status(200).json(result.cart);
  } else {
    res.status(404).json({ message: result.message });
  }
});

module.exports = router;

const { Router } = require("express");
const CartManager = require("../dao/CartManager");

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.deleteProductFromCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const updatedCart = await cartManager.updateCart(cid, products);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cantidad" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartManager.clearCart(cid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

module.exports = router;

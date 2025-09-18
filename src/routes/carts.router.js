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

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ error: `El ID de producto o carrito no es válido.` });
    }
    if (error.message === "Producto no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "Carrito no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    console.error(error);
    res
      .status(500)
      .json({ error: "Error interno al agregar el producto al carrito" });
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

    if (quantity === undefined) {
      return res.status(400).json({ error: "Debe proporcionar una cantidad" });
    }

    const updatedCart = await cartManager.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    res.json(updatedCart);
  } catch (error) {
    if (error.message === "La cantidad debe ser un número positivo") {
      return res.status(400).json({ error: error.message });
    }
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

module.exports = router;

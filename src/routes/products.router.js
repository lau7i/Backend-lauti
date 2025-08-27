const { Router } = require("express");
const ProductManager = require("../dao/ProductManager");

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const limit = req.query.limit;

    if (limit) {
      return res.json(products.slice(0, limit));
    }
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado." });
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);

    // Emitir el evento a todos los clientes conectados
    const products = await productManager.getProducts();
    req.io.emit("productsUpdated", products);

    res.status(201).json(newProduct);
  } catch (error) {
    // ...
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;
    if (updatedFields.id) {
      delete updatedFields.id;
    }
    const updatedProduct = await productManager.updateProduct(
      pid,
      updatedFields
    );
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado." });
    }
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const result = await productManager.deleteProduct(req.params.pid);
    if (result) {
      // Emitir el evento a todos los clientes conectados
      const products = await productManager.getProducts();
      req.io.emit("productsUpdated", products);

      res.status(204).send();
    } else {
      res.status(404).json({ message: "Producto no encontrado." });
    }
  } catch (error) {
    // ...
  }
});

module.exports = router;

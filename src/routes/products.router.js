const { Router } = require("express");
const ProductManager = require("../dao/ProductManager");

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const productsData = await productManager.getProducts({
      limit,
      page,
      sort,
      query,
    });

    const response = {
      status: "success",
      payload: productsData.docs,
      totalPages: productsData.totalPages,
      prevPage: productsData.prevPage,
      nextPage: productsData.nextPage,
      page: productsData.page,
      hasPrevPage: productsData.hasPrevPage,
      hasNextPage: productsData.hasNextPage,
      prevLink: productsData.hasPrevPage
        ? `/api/products?page=${productsData.prevPage}&limit=${limit}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
      nextLink: productsData.hasNextPage
        ? `/api/products?page=${productsData.nextPage}&limit=${limit}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const newProduct = await productManager.addProduct(req.body);
    const products = await productManager.getProducts({});
    req.io.emit("productsUpdated", products.docs);
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: `El código '${error.keyValue.code}' ya existe.` });
    }
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      req.params.pid,
      req.body
    );
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    if (deletedProduct) {
      const products = await productManager.getProducts({});
      req.io.emit("productsUpdated", products.docs);
      res.json({ message: "Producto eliminado" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;

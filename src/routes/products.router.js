const { Router } = require("express");

const ProductManager = require("../dao/ProductManager");

const router = Router();

const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();

  const limit = req.query.limit;

  if (limit) {
    return res.json(products.slice(0, limit));
  }

  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "no se ha encontrado ningun producto." });
  }
});

router.post("/", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);

  res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
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
    res.status(404).json({ message: "no se ha encontrado ningun producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  const result = await productManager.deleteProduct(req.params.pid);

  if (result) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: "no se ha encontrado ningun producto" });
  }
});

module.exports = router;

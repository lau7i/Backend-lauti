const { Router } = require("express");
const ProductManager = require("../dao/ProductManager");

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
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
        ? `/api/products?page=${productsData.prevPage}&limit=${limit || 10}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
      nextLink: productsData.hasNextPage
        ? `/api/products?page=${productsData.nextPage}&limit=${limit || 10}${
            sort ? `&sort=${sort}` : ""
          }${query ? `&query=${query}` : ""}`
        : null,
    };

    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);

    req.io.emit("productsUpdated", await productManager.getProducts({}));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

module.exports = router;

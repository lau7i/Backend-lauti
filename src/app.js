const express = require("express");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

const ProductManager = require("./dao/ProductManager.js");
const productManager = new ProductManager("./src/data/products.json");

const app = express();
const PORT = 8080;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`El servidor está activo en http://localhost:${PORT}`);
});

const io = new Server(httpServer);
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/products", productsRouter);

io.on("connection", (socket) => {
  console.log("¡Nuevo cliente conectado!");

  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    io.emit("productsUpdated", products);
  });

  socket.on("deleteProduct", async (productId) => {
    await productManager.deleteProduct(productId);
    const products = await productManager.getProducts();
    io.emit("productsUpdated", products);
  });
});

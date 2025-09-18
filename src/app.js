const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const ProductManager = require("./dao/ProductManager");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("addProduct", async (product) => {
    try {
      await productManager.addProduct(product);
      const products = await productManager.getProducts({});
      io.emit("productsUpdated", products.docs);
    } catch (error) {
      console.error("Error al agregar producto por socket:", error);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      const products = await productManager.getProducts({});
      io.emit("productsUpdated", products.docs);
    } catch (error) {
      console.error("Error al eliminar producto por socket:", error);
    }
  });
});

mongoose
  .connect(
    "mongodb+srv://coderUser:lau7aro11@cluster0.zshgenr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Conectado a MongoDB");
    server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error de conexión a MongoDB:", error);
  });

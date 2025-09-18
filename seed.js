const mongoose = require("mongoose");
const Product = require("./src/models/product.model");
const fs = require("fs");
const path = require("path");

const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./src/products.json"), "utf-8")
);

mongoose
  .connect(
    "mongodb+srv://coderUser:lau7aro11@cluster0.zshgenr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
    console.log("Conectado a MongoDB para el seeder.");

    await Product.deleteMany({});
    console.log("Productos antiguos eliminados.");

    await Product.insertMany(productsData);
    console.log("¡Productos cargados exitosamente!");

    mongoose.disconnect();
  })
  .catch((error) => {
    console.error("Error en el script de seeder:", error);
    mongoose.disconnect();
  });

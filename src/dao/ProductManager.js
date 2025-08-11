const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getProducts() {
    if (fs.existsSync(this.filePath)) {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    }
    return [];
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === parseInt(id));
    return product;
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      ...product,
      status: true,
      thumbnails: product.thumbnails || [],
    };
    products.push(newProduct);
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(products, null, 2)
    );
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === parseInt(id));

    if (productIndex === -1) {
      return null;
    }

    const updatedProduct = {
      ...products[productIndex],
      ...updatedFields,
      id: products[productIndex].id,
    };
    products[productIndex] = updatedProduct;
    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(products, null, 2)
    );
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const initialLength = products.length;
    const newProducts = products.filter((p) => p.id !== parseInt(id));

    if (newProducts.length === initialLength) {
      return false;
    }

    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(newProducts, null, 2)
    );
    return true;
  }
}

module.exports = ProductManager;

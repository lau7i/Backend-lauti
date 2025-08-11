const fs = require("fs");
const ProductManager = require("./ProductManager");

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.productManager = new ProductManager("./src/data/products.json");
  }

  async getCarts() {
    if (fs.existsSync(this.filePath)) {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      if (data) {
        return JSON.parse(data);
      }
    }
    return [];
  }
  async getCartById(id) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === parseInt(id));
    return cart;
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1,
      products: [],
    };
    carts.push(newCart);
    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((c) => c.id === parseInt(cartId));

    if (cartIndex === -1) {
      return {
        success: false,
        message: "no se han encontrado productos en el carrito.",
      };
    }

    const product = await this.productManager.getProductById(productId);
    if (!product) {
      return { success: false, message: "no se ha encontrado ningun producto" };
    }

    const cart = carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(
      (p) => p.product === parseInt(productId)
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ product: parseInt(productId), quantity: 1 });
    }

    await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return { success: true, cart: cart };
  }
}

module.exports = CartManager;

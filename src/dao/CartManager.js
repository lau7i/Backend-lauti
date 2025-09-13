const Cart = require("../models/cart.model");

class CartManager {
  async getCartById(id) {
    return await Cart.findById(id).populate("products.product").lean();
  }

  async createCart() {
    return await Cart.create({ products: [] });
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(productId)
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await cart.save();
    return cart;
  }

  async deleteProductFromCart(cartId, productId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    );
  }

  async updateCart(cartId, products) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { products: products },
      { new: true }
    );
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await Cart.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );
  }

  async clearCart(cartId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
  }
}

module.exports = CartManager;

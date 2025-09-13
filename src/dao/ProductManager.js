const Product = require("../models/product.model");

class ProductManager {
  async getProducts(options) {
    const { limit = 10, page = 1, sort, query } = options;
    const filter = {};
    if (query) {
      filter.$or = [
        { category: query },
        {
          status:
            query === "true" ? true : query === "false" ? false : undefined,
        },
      ];
    }

    const sortOptions = {};
    if (sort) {
      sortOptions.price = sort === "asc" ? 1 : -1;
    }

    const paginatedProducts = await Product.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOptions,
      lean: true,
    });

    return paginatedProducts;
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async addProduct(productData) {
    return await Product.create(productData);
  }

  async updateProduct(id, updatedFields) {
    return await Product.findByIdAndUpdate(id, updatedFields, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = ProductManager;

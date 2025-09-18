const socket = io();

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    category: document.getElementById("category").value,
  };
  socket.emit("addProduct", product);
  productForm.reset();
});

socket.on("productsUpdated", (products) => {
  const productList = document.getElementById("productList");
  if (!productList) {
    console.error("Error: No se encontró el elemento #productList en el DOM.");
    return;
  }

  if (!Array.isArray(products)) {
    console.error(
      "Error: Los datos recibidos del servidor no son un array.",
      products
    );
    return;
  }

  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <h3>${product.title} (Código: ${product.code})</h3>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Eliminar";
    deleteButton.addEventListener("click", () => {
      socket.emit("deleteProduct", product._id);
    });

    li.appendChild(deleteButton);
    productList.appendChild(li);
  });
});

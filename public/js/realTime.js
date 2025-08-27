const socket = io();

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value),
  };

  socket.emit("addProduct", product);
  productForm.reset();
});

socket.on("productsUpdated", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `<h3>${product.title}</h3><p>Precio: $${product.price}</p>`;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Eliminar";
    deleteButton.addEventListener("click", () => {
      socket.emit("deleteProduct", product.id);
    });
    li.appendChild(deleteButton);
    productList.appendChild(li);
  });
});

let cartId = sessionStorage.getItem("cartId");

async function createCart() {
  try {
    const response = await fetch("/api/carts", { method: "POST" });
    const data = await response.json();
    sessionStorage.setItem("cartId", data._id);
    return data._id;
  } catch (error) {
    console.error("Error al crear el carrito:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!cartId) {
    cartId = await createCart();
  }

  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.getAttribute("data-id");

      if (!cartId) {
        alert(
          "No se pudo obtener un ID de carrito. Intenta recargar la página."
        );
        return;
      }

      try {
        const response = await fetch(
          `/api/carts/${cartId}/products/${productId}`,
          {
            method: "POST",
          }
        );

        if (response.ok) {
          alert("¡Producto agregado al carrito!");
        } else {
          alert("Error al agregar el producto.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});

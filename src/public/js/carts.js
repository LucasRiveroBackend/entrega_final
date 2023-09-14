

const form = document.getElementById("productsForm");
let cartId;
let productId;

document.addEventListener('DOMContentLoaded', async () => {
   let cartId = localStorage.getItem('cartId');

   if (!cartId) {
      // Si no hay cartId almacenado, hacer una petición para crear el carrito
      const cartResponse = await fetch('/api/carts', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         }
      });

      if (cartResponse.status === 200) {
         const cartData = await cartResponse.json();
         cartId = cartData.producto._id;
         localStorage.setItem('cartId', cartId);
      }
   }
   const goToCartButton = document.getElementById('goToCartButton');
   if (goToCartButton) {
      goToCartButton.addEventListener('click', (event) => {
         event.preventDefault();
         if (cartId) {
            window.location.href = `/cart/${cartId}`;
         } else {
            console.error('No hay un cartId disponible.');
         }
      });
   }
});

document.querySelectorAll('.accept-button').forEach(button => {
   button.addEventListener('click', async (event) => {
      event.preventDefault();
      const productId = event.target.getAttribute('data-product-id');
      try {
         // Obtener el cartId almacenado en localStorage
         let cartId = localStorage.getItem('cartId');

         if (!cartId) {
            // Si no hay cartId almacenado, hacer una petición para crear el carrito
            const cartResponse = await fetch('/api/carts', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               }
            });

            if (cartResponse.status === 200) {
               const cartData = await cartResponse.json();
               cartId = cartData.producto._id;
               localStorage.setItem('cartId', cartId);
               const cartIdLabel = document.getElementById('cartIdLabel');
               cartIdLabel.textContent = `Cart ID: ${cartId}`;
            }
         }

         // Realiza la solicitud al servidor con el productId y cartId
         const response = await sendProductRequest(cartId, productId);

         if (response.status === 200) {
            // Producto agregado correctamente, muestra una notificación
            Swal.fire({
               toast: true,
               position: 'top-end',
               showConfirmButton: false,
               timer: 5000,
               title: `Producto agregado correctamente`,
               icon: "success"
            });
            location.reload();
         } else {
            // Manejar el caso de error si es necesario
            console.error('Error al agregar el producto al carrito:', response.statusText);
         }
      } catch (error) {
         // Manejar errores generales aquí
         console.error('Error:', error);
      }
   });
});

async function sendProductRequest(cartId, productId) {
   try {
      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         }
      });
      return response;
   } catch (error) {
      throw error;
   }
}

// Boton Eliminar Carrito
document.querySelectorAll('.delete-button').forEach(button => {
   button.addEventListener('click', async (event) => {
      event.preventDefault();
      const productId = event.target.getAttribute('data-product-id');
      try {
         // Obtener el cartId almacenado en localStorage
         let cartId = localStorage.getItem('cartId');

         if (cartId) {
            // Si no hay cartId almacenado, hacer una petición para crear el carrito
            const cartResponse = await fetch(`/api/carts/${cartId}`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json'
               }
            });

            if (cartResponse.status === 200) {
               localStorage.removeItem('cartId');
               Swal.fire({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 5000,
                  title: `Se elimino el carrito correctamente`,
                  icon: "success"
               });
               location.reload();
            }
         }
      } catch (error) {
         // Manejar errores generales aquí
         console.error('Error:', error);
      }
   });
});
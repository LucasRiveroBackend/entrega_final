let cartId;
let productId;

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


document.querySelectorAll('.subtract-button').forEach(button => {
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
            }
         }
         // Realiza la solicitud al servidor con el productId y cartId
         const response = await subtractProductRequest(cartId, productId);

         if (response.status === 200) {
            
            // Producto eliminado correctamente, muestra una notificación
            Swal.fire({
               toast: true,
               position: 'top-end',
               showConfirmButton: false,
               timer: 5000,
               title: `Producto eliminado correctamente`,
               icon: "success"
            });
            location.reload();
         } else {
            // Manejar el caso de error si es necesario
            console.error('Error al eliminar el producto del carrito:', response.statusText);
         }
      } catch (error) {
         // Manejar errores generales aquí
         console.error('Error:', error);
      }
   });
});

async function subtractProductRequest(cartId, productId) {
   try {
      const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json'
         }
      });
      return response;
   } catch (error) {
      throw error;
   }
}

document.addEventListener('DOMContentLoaded', function() {
   const rows = document.querySelectorAll('table tbody tr');
   const totales = document.querySelector('total-sale');
   let totalSale = 0;
   rows.forEach(function(row) {
     const priceCell = row.querySelector('td:nth-child(2)');
     const quantityCell = row.querySelector('td:nth-child(3)');
     const totalCell = row.querySelector('td.hidden-column');
     
     const price = parseFloat(priceCell.textContent);
     const quantity = parseInt(quantityCell.textContent);
     
     const total = price * quantity;
     totalSale += total
   });
   const totalSaleValue = document.getElementById('totalSaleValue');
   totalSaleValue.textContent = totalSale.toFixed(2);
 });

// boton FINALIZAR COMPRA
document.querySelectorAll('.finish-button').forEach(button => {
   button.addEventListener('click', async (event) => {
      event.preventDefault();
      const table = document.querySelector('table');
      const tableRows = table.querySelectorAll('tbody tr');

      if (tableRows.length === 0) {
         // No hay datos en la tabla, muestra un mensaje de error o realiza alguna acción adecuada
         Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: true,
            timer: 5000,
            title: 'La tabla está vacía. Agregue productos antes de finalizar la compra.',
            icon: 'error'
         });
         return;
      }
      try {
         // Obtener el cartId almacenado en localStorage
         let cartId = localStorage.getItem('cartId');

         if (cartId) {
            // Si no hay cartId almacenado, hacer una petición para crear el carrito
            const cartResponse = await fetch(`/api/carts/${cartId}/purchase`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               }
            });
            if (cartResponse.status === 200) {
               Swal.fire({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 5000,
                  title: `Se generó el ticket correctamente`,
                  icon: "success"
               });
               location.reload();
            }else if(cartResponse.status === 201){
               cartResponse.text().then(message => {
                  const jsonResponse = message
                  const responseObj = JSON.parse(jsonResponse);
                  const mensaje = responseObj.message;
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: true,
                    timer: 10000,
                    title: mensaje, // El mensaje se obtiene de la respuesta
                    icon: "error"
                  });
                  location.reload();
                });
            }
         } else {
            // Manejar el caso de error si es necesario
            console.error('Error al crear ticket:', response.statusText);
         }
      } catch (error) {
         // Manejar errores generales aquí
         console.error('Error:', error);
      }
   });
});
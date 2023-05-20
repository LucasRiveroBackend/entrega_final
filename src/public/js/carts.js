

const form = document.getElementById("productsForm");
let cartId;
let productId;

form.addEventListener('submit', e => {
   e.preventDefault();
   const cartIdLabel = document.getElementById('cartIdLabel');
   cartIdLabel.textContent = `Cart ID: ${cartId}`;
   const data = new FormData(form);

   const obj = {};

   data.forEach((value, key) => obj[key] = value);

   if (!cartId) {
      fetch('/api/carts', {
         method: 'POST',
         body: JSON.stringify(obj),
         headers: {
             'Content-Type': 'application/json'
         }
     }).then(result => {
         if (result.status == 200) {
             return result.json(); // Parse the response body as JSON
         }
     }).then(responseData => {
         cartId = responseData.producto._id; // Access the _id property
         const cartIdLabel = document.getElementById('cartIdLabel');
         cartIdLabel.textContent = `Cart ID: ${cartId}`;
         // Use the cartId as needed
         console.log('CART ID:', cartId);

         // Send request to /api/carts/{cartId}/product/{productId}
         sendProductRequest(obj);
     });
   } else {
      const cartIdLabel = document.getElementById('cartIdLabel');
      cartIdLabel.textContent = `Cart ID: ${cartId}`;
      sendProductRequest(obj);
   }
});

function sendProductRequest(obj) {
   const data = new FormData(form);
   let productId = data.get("productId");
   console.log('PRODUCT ID:', productId);

   fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
          'Content-Type': 'application/json'
      }
   }).then(result => {
      if (result.status == 200) {
          return result.json(); // Parse the response body as JSON
      }
   }).then(responseData => {
      Swal.fire({
         toast:true,
         position: 'top-end',
         showConfirmButton: false,
         timer: 3000,
         title: `Producto agregado correctamente`,
         icon: "success"
     })
   });
}

// Obtener el cartId almacenado en localStorage si existe
cartId = localStorage.getItem('cartId');
const cartIdLabel = document.getElementById('cartIdLabel');
cartIdLabel.textContent = `Cart ID: ${cartId}`;
if (!cartId) {
   // Si no hay cartId almacenado, hacer una petición para crear el carrito
   fetch('/api/carts', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      }
   }).then(result => {
      if (result.status == 200) {
         return result.json();
      }
   }).then(responseData => {
      cartId = responseData.producto._id;
      localStorage.setItem('cartId', cartId);
      const cartIdLabel = document.getElementById('cartIdLabel');
      cartIdLabel.textContent = `Cart ID: ${cartId}`;
   });
}



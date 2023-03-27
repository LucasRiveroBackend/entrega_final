import ProductManager from './ProductManager/ProductManager.js';

const productManager = new ProductManager();


const env = async () =>{

   console.log('************* Prueba 1 ****************')
   const product = await productManager.getProducts();
   console.log(product);
   console.log('************* Fin Prueba 1 ****************')

   // console.log('************* Prueba 2 ****************')
   // const resultado = await productManager.addProduct('producto prueba1000', 'Este es un producto prueba', 200, 'Sin imagen', '1002', 25);
   // console.log(resultado);
   // const product2 = await productManager.getProducts();
   // console.log(product2);
   // console.log('************* Fin Prueba 2 ****************')

   // console.log('************* Prueba 3 ****************')
   // const buscarProductoId = await productManager.getProductById(2);
   // console.log(buscarProductoId);
   // console.log('************* Fin Prueba 3 ****************')

   // console.log('************* Prueba 4 ****************')
   // const updatePrd = await productManager.updateProduct(2, { price: 1000 });
   // console.log(updatePrd)
   // const updatedProduct = await productManager.getProductById(2);
   // console.log(updatedProduct);
   // console.log('************* Fin Prueba 4 ****************')

   // console.log('************* Prueba 5 ****************')
   // const productoDelete = await productManager.deleteProduct(2);
   // console.log(productoDelete);
   // const productsAfterDelete = await productManager.getProducts();
   // console.log(productsAfterDelete);
   // console.log('************* Fin Prueba 5 ****************')
} 

env()
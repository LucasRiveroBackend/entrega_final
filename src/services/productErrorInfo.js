export const generateProductErrorInfo = (product) =>{
   return `
   Alguno de los campos para crear el producto no es valido:
   Lista de campos requeridos:
   title: Debe ser un campo string, pero recibio ${product.title}
   description: Debe ser un campo string, pero recibio ${product.description}
   price: Debe ser un campo string, pero recibio ${product.price}
   code: Debe ser un campo string, pero recibio ${product.code}
   stock: Debe ser un campo numerico, pero recibio ${product.stock}
   category: Debe ser un campo string, pero recibio ${product.category}
   `
}
import {Faker, en, es } from "@faker-js/faker";


export const customFaker = new Faker({
    locale: [en],
})

const { commerce, image, database, string, internet, person, phone, datatype, lorem } = customFaker;

const generateProduct = () => {
    return {
      title: commerce.productName(),
      description: commerce.productDescription(),
      price: parseFloat(commerce.price()),
      thumbnail: image.url(),
      code: string.uuid(),
      stock: parseInt(string.numeric(2)),
      id:parseInt(string.numeric(5)),
      category: commerce.productAdjective(),
      status: datatype.boolean(),
      _id: database.mongodbObjectId(),
    }
}

export const loadProducts = async () =>{
   const productsNumber = 100
   let products = [];
   for (let i = 0; i < productsNumber; i++) {
       const product = generateProduct();
       products.push(product);
   }
   return products
}
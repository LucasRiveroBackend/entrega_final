export const generateCartErrorInfo = (ticket) =>{
   return `
   Alguno de los campos para agregar el producto no es valido:
   Lista de campos requeridos:
   Email: Debe ser un campo string, pero recibio ${ticket.email}
   `
}
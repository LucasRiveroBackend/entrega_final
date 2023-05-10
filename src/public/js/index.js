// const socket = io();

// const log = document.getElementById('log').getElementsByTagName('tbody')[0];
// const btnAgregar = document.getElementById("agregar");
// const btnEliminar = document.getElementById("eliminar");


// socket.on('log', data => {
//   log.innerHTML = "";
//   for (let i = 0; i < data.length; i++) {
//     const row = log.insertRow(-1);
//     const idCell = row.insertCell(0);
//     const titleCell = row.insertCell(1);
//     const priceCell = row.insertCell(2);
    
//     idCell.innerHTML = data[i].id;
//     titleCell.innerHTML = data[i].title;
//     priceCell.innerHTML = data[i].price;
//   }
//   console.log('cliente conectado');
// });

// // emito mensaje al servidor
// socket.emit('message', 'cliente conectado');

// btnAgregar.addEventListener("click", (event) => {
//    if (event) {
//      const title = document.getElementById("title").value;
//      const description = document.getElementById("description").value;
//      const code = document.getElementById("code").value;
//      const price = document.getElementById("price").value;
//      const stock = document.getElementById("stock").value;
//      const category = document.getElementById("category").value;
//      const thumbnail = document.getElementById("thumbnail").value;
 
//      const nuevoProducto = {
//        title,
//        description,
//        price,
//        thumbnail,
//        code,
//        stock,
//        category,
//      };
 
//      socket.emit("message", nuevoProducto);
//    }
//    // inicializo las variables
//    title.value = "";
//    description.value = "";
//    price.value = "";
//    thumbnail.value = "";
//    code.value = "";
//    stock.value = "";
//    category.value = "";
//  });

//  btnEliminar.addEventListener("click", (event) => {
//    if (event) {
//      const id = document.getElementById("id").value;
//      console.log('ID: ', id);
//      document.getElementById("id").value = "";
//      socket.emit("eliminar", id);
//    }
//  });

const socket = io();
let user;

const chatbox = document.getElementById('chatbox');

Swal.fire({
    title: "Identifícate",
    input: "text",
    inputValidator: (value) =>{
        return !value && "Necesita escribir el nombre de usuario para iniciar!"
    },
    allowOutsideClick: false,
    toast: true 
}).then(result =>{
    user  = result.value;
let usario = {
    user: user,
    origin: front
}

    socket.emit('authenticated', usuario);
})

chatbox.addEventListener('keyup', evt =>{
    console.log(evt);
    if(evt.key === "Enter"){
        if(chatbox.value.trim().length>0){
            socket.emit('message', {user:user, message:chatbox.value.trim()})
            chatbox.value = "";
        }
    }
})

socket.on('messageLogs', data =>{
    if(!user) return;

    let log = document.getElementById('messageLogs');
    let messages = "";

    data.forEach(message => {
        messages +=  `${ message.user } dice: ${ message.message } <br/>  `       
    });
    log.innerHTML = messages

})


socket.on('newUserConnected', data =>{
    if(!user) return;
    Swal.fire({
        toast:true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: "success"
    })
})

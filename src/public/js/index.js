const socket = io();
// const log = document.getElementById('log');

const log = document.getElementById('log').getElementsByTagName('tbody')[0];

socket.on('log', data => {
  for (let i = 0; i < data.length; i++) {
    const row = log.insertRow(-1);
    const idCell = row.insertCell(0);
    const titleCell = row.insertCell(1);
    const priceCell = row.insertCell(2);
    
    idCell.innerHTML = data[i].id;
    titleCell.innerHTML = data[i].title;
    priceCell.innerHTML = data[i].price;
  }
  console.log('cliente conectado');
});

// emito mensaje al servidor
socket.emit('message', 'cliente conectado');
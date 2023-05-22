// const form = document.getElementById("loginForm");
// const errorMessage = document.getElementById("errorMessage");
// form.addEventListener('submit', e =>{
//     e.preventDefault();

//     const data = new FormData(form);

//     const obj = {};

//     data.forEach((value,key) => obj[key]=value)

//     fetch('/api/session/login',{
//         method: 'POST',
//         body: JSON.stringify(obj),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).then(result=>{
//         if(result.status == 200){
//             window.location.replace('/products')
//         }
//     }).then(data => {
//         // Mostrar mensaje de error
//         errorMessage.textContent = data.error;
//       }).catch(error => {
//         console.error('Error:', error);
//       });
// })


const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => obj[key] = value);

  fetch('/api/session/login', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(result => {
    if (result.status === 200) {
      window.location.replace('/products');
    } else {
      return result.json().then(data => {
        errorMessage.textContent = data.error;
      });
    }
  }).catch(error => {
    console.error('Error:', error);
  });
});
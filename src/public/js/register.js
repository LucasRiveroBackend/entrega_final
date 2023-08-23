const form = document.getElementById('registerForm');


form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    console.log('data: ', JSON.stringify(data))
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    console.log('obj: ', JSON.stringify(obj))
    fetch('/api/session/register',{
        method:'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result=>{
        if(result.status == 200){
            // window.location.replace('/products')
        }
    })
})
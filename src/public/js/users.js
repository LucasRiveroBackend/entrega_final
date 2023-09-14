function cambiarRol(userId) {
  const data = { _id: userId }; // Datos a enviar en la solicitud

  fetch(`/api/users/premium/${userId}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(result => {
    if (result.status == 200) {
      return result.json(); // Parsea la respuesta JSON
    }
  })
  .then(responseData => {
    if (responseData.status === 'success') {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `Rol modificado correctamente`,
        icon: "success"
      });
      // Recarga la página después de 2 segundos
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      Swal.fire('Error', responseData.message, 'error');
    }
  })
  .catch(error => {
    console.error(error);
    Swal.fire('Error', 'Hubo un problema al realizar la solicitud', 'error');
  });
}

function eliminarUsuario(userId) {
  const data = { _id: userId };

  fetch(`/api/users/${userId}`, {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(result => {
    if (result.status == 200) {
      return result.json(); // Parsea la respuesta JSON
    }
  })
  .then(responseData => {
    if (responseData.status === 'success') {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `Usuario eliminado correctamente`,
        icon: "success"
      });
      // Recarga la página después de 2 segundos
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      Swal.fire('Error', responseData.message, 'error');
    }
  })
  .catch(error => {
    console.error(error);
    Swal.fire('Error', 'Hubo un problema al realizar la solicitud', 'error');
  });
}
/**
  * Facilita la asignación del header HTTP Authorization para las request.
  * @param {string} token
  * @param {js:obj} obj
  * @returns obj\n
  * El objeto pasado por parametro pero con el header 'Authorization' agregado.
  */
export default function addHeaderAuth(token, obj) {
  obj.headers.Authorization = 'Token ' + token;
  return obj;
}

// export default const basicPost = {
//   headers: {
//     Authorization: 'Token ' + 
//   }
// }

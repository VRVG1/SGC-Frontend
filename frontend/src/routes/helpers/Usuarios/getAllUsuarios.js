import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
/**
 * Metodo para hacer la peticion a la base de datos y recibir todos los usuarios
 * @returns array con todos los usuarios
 */
const getAllUsuarios = async (token) => {

    let get = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    get = AuthPostBasics(token, get);
    const url = "http://localhost:8000/usuario/users";
    const res = await fetch(url, get);
    const data =  res.json();
    return data;
}

export default getAllUsuarios;
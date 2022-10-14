import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
/**
 * Metodo para hacer la peticion a la base de datos y recibir todas las materias
 * @returns array con todas las materias
 * @param {string} token
 */
const getAllMaterias = async (token) => {
    let get = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    get = AuthPostBasics(token, get);

    const url = "http://localhost:8000/materia/materias";
    const res = await fetch(url, get);
    const data =  res.json();
    return data;
}

export default getAllMaterias;
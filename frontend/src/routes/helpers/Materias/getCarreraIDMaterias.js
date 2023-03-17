import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
/**
 * Metodo para obtener todas las materias que sean de una materia
 * @returns array con todas las materias
 * @param {string} token
 * @param {string} id
 */
const getMateriaXCarrera = async (token, id) => {
    let get = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    get = AuthPostBasics(token, get);
    const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "materia/materiaXcarrera/" + id;
    const res = await fetch(url, get);
    const data =  res.json();
    return data;
}

export default getMateriaXCarrera;
import AuthPostBasic from '../Auth/AuthPostBasis.js';
const getAllAsignanUser = async (token, id) => {
    let get = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    get = AuthPostBasic(token, get);
    const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "materia/asignan-allpk/" + id;
    const res = await fetch(url, get);
    const result = await res.json();
    return result;
}

export default getAllAsignanUser;
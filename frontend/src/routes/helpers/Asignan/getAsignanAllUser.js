import AuthPostBasic from '../Auth/AuthPostBasis.js';
const getAsignanAllUser = async (token) => {
    let get = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    get = AuthPostBasic(token, get);
    const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "/materia/asignan";
    const res = await fetch(url, get);
    const result = await res.json();
    return result;
}

export default getAsignanAllUser;
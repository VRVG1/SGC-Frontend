import AuthPostBasic from '../Auth/AuthPostBasis.js';
const asignanCNames_allpk = async (token, id) => {
    let get = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    get = AuthPostBasic(token, get);
    const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "materia/asignanCNames-allpk/" + id;
    const res = await fetch(url, get);
    const result = await res.json();
    return result;
}

export default asignanCNames_allpk;
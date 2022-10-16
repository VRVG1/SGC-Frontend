import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
const getOneRepirte = async (token, id) =>{
    let get = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    get = AuthPostBasics(token, get);
    const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "reporte/get-reporte/"+id;
    const res = await fetch(url, get);
    const result = await res.json();
    return result;
}

export default getOneRepirte;
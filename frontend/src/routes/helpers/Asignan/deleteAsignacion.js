import AuthPostBasic from '../Auth/AuthPostBasis.js';
const deleteAsignacion = async (token, id) => {
    let get = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    };
    get = AuthPostBasic(token, get);
    const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "materia/delete-asign/" + id;
    const res = await fetch(url, get);
    const result = await res.json();
    return result;
}
export default deleteAsignacion;
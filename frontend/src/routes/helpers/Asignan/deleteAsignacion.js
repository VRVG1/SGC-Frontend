import AuthPostBasic from '../Auth/AuthPostBasis.js';
const deleteAsignacion = async (token, id) => {
    let get = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    };
    get = AuthPostBasic(token, get);
    const url = "http://localhost:8000/materia/delete-asign/" + id;
    const res = await fetch(url, get);
    const result = await res.json();
    return result;
}
export default deleteAsignacion;
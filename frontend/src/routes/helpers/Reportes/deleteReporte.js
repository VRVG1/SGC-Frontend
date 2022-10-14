import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
/**
 * Helper para la peticion de borrar un reporte
 * @param {string} id 
 * @param {string} token 
 * @returns 
 */
const deleteMateria = async (token, id) => {
    let deletes = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    deletes = AuthPostBasics(token, deletes);
    const url = "http://localhost:8000/reporte/delete-reporte/" + id;
    const res = await fetch(url, deletes);
    const result = res.statusText;
    return result;
}

export default deleteMateria;
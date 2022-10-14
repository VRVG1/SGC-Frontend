import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
/**
 * Helper para la peticion de borrar una materia
 * @param {string} id 
 * @param {string} token 
 * @returns 
 */
const deleteMateria = async (id, token) => {
    let post = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    post = AuthPostBasics(token, post);
    const url = "http://localhost:8000/materia/delete-materia/" + id;
    const res = await fetch(url, post);
    const result = res.statusText;
    return result;
}

export default deleteMateria;
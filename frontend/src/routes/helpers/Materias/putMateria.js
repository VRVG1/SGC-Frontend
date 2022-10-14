import AuthPostBasics from '../Auth/AuthPostBasis.js';
/**
 * Helper para la peticion de actualizacion de una materia
 * @param {obj:string} dataPost 
 * @param {string} id 
 * @param {string} token 
 * @returns 
 */
const putMateria = async (dataPost, id, token) => {
    let post = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            ID_Materia: dataPost.Materia_ID,
            Nombre_Materia: dataPost.Materia_name,
            Carrera: ""
        })
    };
    post = AuthPostBasics(token, post);
    const res = await fetch('http://localhost:8000/materia/update-materia/' + id, post);
    const result = res.statusText;
    return result;
}
export default putMateria;
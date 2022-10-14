import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
/**
 * 
 * @param {js:obj} dataPost 
 * @param {string} id 
 * @param {string} token 
 * @returns 
 */
const putCarrera = async (dataPost, id, token) => {
    let post = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            ID_Carrera: dataPost.id_carrera,
            Nombre_Carrera: dataPost.carrera_nombre
        })
    };
    post = AuthPostBasics(token, post);
    const url = "http://localhost:8000/materia/update-carrera/" + id;
    const res = await fetch(url, post);
    const result = res.statusText;
    return result;
}
export default putCarrera
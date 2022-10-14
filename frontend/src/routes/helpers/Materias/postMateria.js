import AuthPostBasics from '../Auth/AuthPostBasis.js';
/**
 * Helper para la peticion de agregar una materia
 * @param {obj:string} dataPost 
 * @param {string} token 
 * @returns 
 */
const postMateria = async (dataPost, token) => {
    let post = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ID_Materia: dataPost.Materia_ID,
            Nombre_Materia: dataPost.Materia_name,
        })
    };
    post = AuthPostBasics(token, post);
    const res = await fetch('http://127.0.0.1:8000/materia/create_materia', post);
    const result = res.statusText;
    return result;
}

export default postMateria;
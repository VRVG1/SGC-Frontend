import AuthPostBasics from '../Auth/AuthPostBasis.js';
/**
 * Helper para la peticion de actualizacion de una materia
 * @param {obj:string} dataPost 
 * @param {string} id 
 * @param {string} token 
 * @returns 
 */
const putMateria = async (dataPost, id, token) => {
    console.log(dataPost)
    let post = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            Clave_reticula: dataPost.Materia_reticula,
            Nombre_Materia: dataPost.Materia_name,
            horas_Teoricas: dataPost.Materia_horas_teoricas,
            horas_Practicas: dataPost.Materia_horas_practicas,
            creditos: dataPost.Materia_creditos,
            unidades: dataPost.Materia_unidades,
            Carrera: dataPost.materia_carrera,
        })
    };
    console.log(post)
    post = AuthPostBasics(token, post);
    const jsonData = require('../../../variables.json'); 
    const res = await fetch(jsonData.host+'materia/update-materia/' + id, post);
    const result = res.statusText;
    return result;
}
export default putMateria;
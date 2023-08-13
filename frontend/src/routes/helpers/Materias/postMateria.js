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
            Clave_reticula: dataPost.Materia_reticula,
            Carrera: dataPost.materia_carrera,
            Nombre_Materia: dataPost.Materia_name,
            horas_Teoricas: dataPost.Materia_horas_teoricas,
            horas_Practicas: dataPost.Materia_horas_practicas,
            creditos: dataPost.Materia_creditos,
            unidades: dataPost.Materia_unidades
        })
    };
    post = AuthPostBasics(token, post);
    const jsonData = require('../../../variables.json'); 
    const res = await fetch(jsonData.host+'materia/create_materia', post);
    const result = res.statusText;
    return result;
}

export default postMateria;
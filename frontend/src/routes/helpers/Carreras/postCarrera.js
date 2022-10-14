import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
/**
 * Metodo para hacer la peticion a la base de datos de agregar una carrera
 * @param {*} dataPost 
 * @param {*} token 
 * @returns 
 */
const postCarrera = async (dataPost, token) => {
    let post = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ID_Carrera: dataPost.id_carrera,
            Nombre_Carrera: dataPost.carrera_nombre
        })
    };
    post = AuthPostBasics(token, post);
    const url = "http://localhost:8000/materia/create_carrera";
    const res = await fetch(url, post);
    const result = res.statusText;
    return result;
}

export default postCarrera;
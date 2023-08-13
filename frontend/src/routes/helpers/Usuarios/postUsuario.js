import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
/**
 * Helper para realaizar post en la base de datos a la tabla usuarios
 * @param {*} dataPost 
 * @returns resultado de la operacion
 */
const postUsuario = async (dataPost, token) => {
    let post = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ID_Usuario: {
                username: dataPost.username,
                password: dataPost.password,
            },
            Nombre_Usuario: dataPost.Nombre_Usuario,
            Tipo_Usuario: dataPost.Tipo_Usuario,
            CorreoE: dataPost.CorreoE,
            Permiso: dataPost.seleccion,
        })
    };
    post = AuthPostBasics(token, post);
    const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "usuario/create_user"
    const res = await fetch(url, post);
    const result = res.statusText;
    return result
}

export default postUsuario;
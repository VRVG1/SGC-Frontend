import AuthPostBasic from '../Auth/AuthPostBasis.js';
/**
 * Metodo helper para actualizar los datos del usuario 
 * @param {Array} dataUser datos del usuario
 * @param {*} id PK del usuario 
 * @returns 
 */
const putUsuarios = async (dataUser, id, token) => {
    if (dataUser.seleccion) {
        dataUser.seleccion = 1;
    } else {
        dataUser.seleccion = 0;
    }
    let post = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ID_Usuario: {
                username: dataUser.username,
                password: dataUser.password,
            },
            Nombre_Usuario: dataUser.Nombre_Usuario,
            Tipo_Usuario: dataUser.Tipo_Usuario,
            CorreoE: dataUser.CorreoE,
            Permiso: dataUser.seleccion,
        })
    }
    post = AuthPostBasic(token, post);
    const url = "http://localhost:8000/usuario/update-user/" + id;
    const res = await fetch(url, post);
    const result = res.statusText;
    return result;
}

export default putUsuarios;
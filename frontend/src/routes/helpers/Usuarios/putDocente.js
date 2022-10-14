import AuthPostBasic from '../Auth/AuthPostBasis.js';
/**
 * Metodo helper para actualizar los datos del usuario en la vista del docente
 * @param {Array} dataUser datos del usuario
 * @param {*} id PK del usuario 
 * @returns 
 */
const putDocente = async (dataUser, token) => {
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
            CorreoE: dataUser.CorreoE,
        })

    }
    post = AuthPostBasic(token, post);
    const url = "http://localhost:8000/usuario/update-Ownuser/" + dataUser.PK;
    const res = await fetch(url, post);
    const result = res.statusText;
    console.log("dasd",result)
    return result;
}

export default putDocente;
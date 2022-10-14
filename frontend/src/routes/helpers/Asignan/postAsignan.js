import AuthPostBasics from '../Auth/AuthPostBasis.js';

const postAsigna = async (dataPost, token, user_id) => {
    console.log(dataPost);
    let post = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ID_Materia: dataPost.materia_ID,
            ID_Usuario: user_id,
            ID_Carrera: dataPost.carrera_ID,
            Grado: dataPost.semestre,
            Grupo: dataPost.grupo,
        })
    };
    post = AuthPostBasics(token, post);
    const res = await fetch('http://localhost:8000/materia/asign_materia', post);
    const result = res.statusText;
    return result;
}

export default postAsigna;
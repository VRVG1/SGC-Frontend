import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
const deleteCarrera = async (id, token) => {
    let deleteC = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    deleteC = AuthPostBasics(token, deleteC);
    const url = "http://localhost:8000/materia/delete-carrera/" + id;
    const res = await fetch(url, deleteC);
    const result = res.statusText;
    return result;
}

export default deleteCarrera;
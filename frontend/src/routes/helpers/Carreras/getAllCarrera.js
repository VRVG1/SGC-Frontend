import AuthPostBasic from '../Auth/AuthPostBasis';
const getAllCarrera = async (token) => {
    let get = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    get = AuthPostBasic(token, get);
    const url = "http://localhost:8000/materia/carreras";
    const res = await fetch(url, get);
    const data = res.json();
    return data;
}

export default getAllCarrera;
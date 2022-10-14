import AuthPostBasic from '../Auth/AuthPostBasis.js';
const getAsignanAllUser = async (token) => {
    let get = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    get = AuthPostBasic(token, get);
    const url = "http://localhost:8000/materia/asignan";
    const res = await fetch(url, get);
    const result = await res.json();
    console.log(res)
    return result;
}

export default getAsignanAllUser;
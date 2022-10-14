import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
const getOneRepirte = async (token, id) =>{
    let get = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    get = AuthPostBasics(token, get);
    const url = "http://localhost:8000/reporte/get-reporte/"+id;
    const res = await fetch(url, get);
    const result = await res.json();
    return result;
}

export default getOneRepirte;
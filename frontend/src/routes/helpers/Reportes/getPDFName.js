import AuthPostBasics from '../Auth/AuthPostBasis.js';
/**
 * Metodo para hacer la peticion a la base de datos y los nombres del pdf que tiene ese asigna
 * @param {*} token 
 * @returns array con todos los reportes
 */
const getPDFName = async (PK, token) => {
    let get = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    get = AuthPostBasics(token, get);
    const url = "http://localhost:8000/reporte/get-alojanFrom/" + PK;
    const res = await fetch(url, get);
    const result = res.statusText;
    const data = await res.json();
    return data;
}

export default getPDFName;
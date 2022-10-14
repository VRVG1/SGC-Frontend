import AuthPostBasics from '../Auth/AuthPostBasis.js';
/**
 * Metodo para hacer la peticion a la base de datos y recibir todos los reportes
 * @param {*} token 
 * @returns array con todos los reportes
 */
const getAllReportes = async (token) => {
    let get = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    get = AuthPostBasics(token, get);
    const url = "http://localhost:8000/reporte/reportes";
    const res = await fetch(url, get);
    const result = res.statusText;
    const data = res.json();
    return data;
}

export default getAllReportes;
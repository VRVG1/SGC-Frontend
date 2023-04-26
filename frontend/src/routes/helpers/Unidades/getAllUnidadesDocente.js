import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
/**
 * Metodo que obtiene los reportes de unidades de la base de datos
 * los reportes de unidades son los reportes del indice de reprobados
 * de cada unidad de cada materia.
 * @returns array con los reportes de unidad del docente
 */
const getAllUnidadesDocente = async (token, PK) => {
    let get = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    get = AuthPostBasics(token, get);
    const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "reporte/getRUnidades/" + PK;
    const res = await fetch(url, get);
    const data =  res.json();
    return data;
}

export default getAllUnidadesDocente;
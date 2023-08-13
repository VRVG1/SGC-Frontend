import AuthPostBasis from '../Auth/AuthPostBasis.js';

const putReportesUnidad = async (token, dataPost) => {
    let put = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Fecha_Entrega: dataPost.Fecha_Entrega,
            Reprobados: dataPost.Reprobados,
        })
    };
    put = AuthPostBasis(token, put);
    const jsonData = require('../../../variables.json'); 
    const res = await fetch(jsonData.host + "reporte/entregaUnidad/" + dataPost.ID_Generacion, put);
    const result = res.statusText;
    return result;
}
export default putReportesUnidad;
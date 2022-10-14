import AuthPostBasis from '../Auth/AuthPostBasis.js';

const putReportes = async (token, id, dataPost) => {
    let put = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Nombre_Reporte: dataPost.Repostes_name,
            Fecha_Entrega: dataPost.Repostes_fecha,
            Descripcion: dataPost.Repostes_descripcion,
            Opcional: dataPost.Repostes_obligatorio,
        })
    };
    put = AuthPostBasis(token, put);
    const res = await fetch("http://localhost:8000/reporte/update-reporte/" + id, put);
    const result = res.statusText;
    return result;
}
export default putReportes;
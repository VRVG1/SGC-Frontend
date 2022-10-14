import AuthPostBasics from '../Auth/AuthPostBasis.js';
const deletePDF = async (token, ID_Generacion) => {
    console.log(ID_Generacion)
    let put = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    put = AuthPostBasics(token, put);
    const url = 'http://localhost:8000/reporte/delete-Alojan/' + ID_Generacion;
    const res = await fetch(url, put);
    const result = res.statusText;
    return result;
}
export default deletePDF;
import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
const putGeneran = async (token, ID_Generacion) => {
    console.log(ID_Generacion)
    let put = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    put = AuthPostBasics(token, put);
    const url = 'http://localhost:8000/reporte/create-gen/' + ID_Generacion;
    const res = await fetch(url, put);
    const result = res.statusText;
    return result;
}
export default putGeneran;
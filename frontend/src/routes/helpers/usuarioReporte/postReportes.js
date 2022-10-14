import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
const postReportes = async (token, formData) =>{
    let post = {
        method: 'POST',
        headers: {
        },
        body: formData
    }
    post = AuthPostBasics(token, post);
    const res = await fetch('http://127.0.0.1:8000/reporte/create-alojan', post);
    const result = res.statusText;
    return result;

}

export default postReportes;

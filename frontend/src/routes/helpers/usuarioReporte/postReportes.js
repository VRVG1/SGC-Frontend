import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
const postReportes = async (token, formData) =>{
    let post = {
        method: 'POST',
        headers: {
        },
        body: formData
    }
    post = AuthPostBasics(token, post);
    const jsonData = require('../../../variables.json'); 
    const res = await fetch(jsonData.host + 'reporte/create-alojan', post);
    const result = res.statusText;
    return result;

}

export default postReportes;

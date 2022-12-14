import AuthPostBasics from '../Auth/AuthPostBasis.js';
const getInfoUser = async (token) =>{
    let post = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    post = AuthPostBasics(token, post);
    const jsonData = require('../../../variables.json'); 
    const url = jsonData.host + "usuario/getInfo";
    const res = await fetch(url, post);
    const data =  res.json();
    return data;
}
export default getInfoUser;
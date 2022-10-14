import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
const postMSM = async (token, mensajeTXT, pk) =>{
    console.log(mensajeTXT, pk);
    let post = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        //Para alguin con pk
        //general pk = 0
        body: JSON.stringify({
            pk: pk,
            msg: mensajeTXT
        })
    }
    post = AuthPostBasics(token, post);
    const res = await fetch('http://127.0.0.1:8000/reporte/admin-mail', post);
    const result = res.statusText;
    return result;

}

export default postMSM;

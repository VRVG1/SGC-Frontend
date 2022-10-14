import AuthPostBasics from '../Auth/AuthPostBasis.js';

const sendAsigna = async (token, id) => {
    let post = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };
    post = AuthPostBasics(token, post);
    const res = await fetch('http://localhost:8000/reporte/send-genera/' + id, post);
    const result = res.statusText;
    console.log(res)
    return result;
}

export default sendAsigna;
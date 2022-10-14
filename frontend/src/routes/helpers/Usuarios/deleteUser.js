import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
const deleteUser = async (id, token) =>{
    let post = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    post = AuthPostBasics(token, post);
    const url = "http://localhost:8000/usuario/delete-user/" + id;
    const res = await fetch(url, post);
    const result = res.statusText;
    console.log("res", res);
    return result;
}

export default deleteUser;
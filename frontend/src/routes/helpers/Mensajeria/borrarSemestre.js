/**
 * Helper para hacer la borracion de todos los asignan, generarn, aloja y reportes que existen
 */
 import AuthPostBasics from '../Auth/AuthPostBasis.js'; 
 const borrarSemestre = async (token) =>{
     let post = {
         method: 'GET',
         headers: {
             'Content-Type': 'application/json',
         },
     }
     post = AuthPostBasics(token, post);
     const jsonData = require('../../../variables.json'); 
     const res = await fetch(jsonData.host+'reporte/startNew', post);
     const result = res.statusText;
     console.log(result);
     return result;
 
 }
 
 export default borrarSemestre;
 
import AuthPostBasics from "../Auth/AuthPostBasis.js"
/**
 *
 * @param {js:obj} dataPost
 * @param {string} id
 * @param {string} token
 * @returns
 */
const putCarrera = async (dataPost, id, token) => {
  let post = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ID_Carrera: dataPost.id_carrera,
      Nombre_Carrera: dataPost.carrera_nombre,
    }),
  }
  console.log(dataPost, id, token)
  post = AuthPostBasics(id, post)
  const jsonData = require("../../../variables.json")
  const url = jsonData.host + "materia/update-carrera/" + dataPost.id_carrera
  const res = await fetch(url, post)
  const result = res.statusText
  return result
}
export default putCarrera

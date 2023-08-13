import AuthPostBasics from "../Auth/AuthPostBasis.js"

const postAsigna = async (dataPost, token) => {
  console.log(dataPost)
  let post = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Nombre_Reporte: dataPost.Repostes_name,
      Fecha_Entrega: dataPost.Repostes_fecha,
      Descripcion: dataPost.Repostes_descripcion,
      Opcional: !dataPost.Repostes_obligatorio,
      Calificaciones: dataPost.Repostes_calificacion,
    }),
  }
  post = AuthPostBasics(token, post)
  const jsonData = require("../../../variables.json")
  const res = await fetch(jsonData.host + "reporte/save-reporte", post)
  const result = res.statusText
  return result
}

export default postAsigna

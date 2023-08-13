import AuthPostBasics from "../Auth/AuthPostBasis.js"

const urls = {
  Carrera: "materia/p2MatXC/",
  Hora: "materia/p2MatXH/",
  Aula: "materia/p2MatXA/",
  Grupo: "materia/p2MatXG/",
  Maestro: "materia/p2MatXM/",
  Creditos: "materia/p2MatXCred/",
  Unidades: "materia/p2MatXU/",
}
/**
 * Hace llamado a la base de datos de forma constante enviandole una cadena
 * para que la base de datos filtre segun la opcion seleccionada
 * @param {int} token
 * @param {string} txt
 * @returns
 */
const filtroMat = async (token, txt, filtro) => {
  txt = txt.replace(/\s+/g, "%20")
  let get = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  get = AuthPostBasics(token, get)
  const jsonData = require("../../../variables.json")
  const url = jsonData.host + urls[filtro] + txt
  console.log(url)
  const res = await fetch(url, get)
  const data = res.json()
  return data
}

export default filtroMat

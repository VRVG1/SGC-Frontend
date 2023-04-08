import AuthPostBasics from "../Auth/AuthPostBasis.js"

const urls = {
  Carrera: "usuario/p2MaeXC/",
  Hora: "usuario/p2MaeXH/",
  Mayor_Indice: "usuario/p2MaeXIA",
  Menor_Indice: "usuario/p2MaeXIB",
}
/**
 * Hace llamado a la base de datos de forma constante enviandole una cadena
 * para que la base de datos filtre segun la opcion seleccionada
 * @param {int} token
 * @param {string} txt
 * @returns
 */
const filtroU = async (token, txt, filtro) => {
  let get = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  get = AuthPostBasics(token, get)
  const jsonData = require("../../../variables.json")
  let url = ""
  if (filtro === "Mayor_Indice" || filtro === "Mayor_Indice") {
    url = jsonData.host + urls[filtro]
  } else {
    url = jsonData.host + urls[filtro] + txt
  }
  const res = await fetch(url, get)
  const data = res.json()
  return data
}

export default filtroU

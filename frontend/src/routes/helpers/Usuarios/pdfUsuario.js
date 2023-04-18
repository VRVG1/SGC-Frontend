import AuthPostBasics from "../Auth/AuthPostBasis.js"

const urls = {
  Carrera: "usuario/p2MaeXCPDF/",
  Hora: "usuario/p2MaeXHPDF/",
  Mayor_Indice: "usuario/p2MaeXIAPDF",
  Menor_Indice: "usuario/p2MaeXIBPDF",
  Calificaciones: "usuario/p2MaeNCPDF",
}
/**
 * Mediante el txt recivido y el filtro, este hace la peticion a Django
 * para descargar el PDF que se va a visualizar en otra pestana
 * @param {int} token
 * @param {string} txt
 * @param {string} filtro
 */
const pdfUsuario = async (token, txt, filtro) => {
  let get = {
    method: "GET",
    headers: {},
  }
  // ContentType: cors

  get = AuthPostBasics(token, get)
  const jsonData = require("../../../variables.json")
  let url = ""
  if (filtro === "Mayor_Indice" || filtro === "Menor_Indice") {
    url = jsonData.host + urls[filtro]
    console.log(url)
  } else {
    url = jsonData.host + urls[filtro] + txt
  }
  await fetch(url, get)
    .then((response) => {
      response.blob().then((myBlob) => {
        const objectURL = URL.createObjectURL(myBlob)
        window.open(objectURL, "_blank")
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

export default pdfUsuario

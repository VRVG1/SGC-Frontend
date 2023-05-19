import AuthPostBasics from "../Auth/AuthPostBasis.js"

const urls = {
  Carrera: "materia/p2MatXCPDF/",
  Hora: "materia/p2MatXHPDF/",
  Aula: "materia/p2MatXAPDF/",
  Grupo: "materia/p2MatXGPDF/",
  Maestro: "materia/p2MatXMPDF/",
  Creditos: "materia/p2MatXCredPDF/",
  Unidades: "materia/p2MatXUPDF/",
  AllCarrera: "materia/p2AllCarrerasPDF",
}
/**
 * Mediante el txt recivido y el filtro, este hace la peticion a Django
 * para descargar el PDF que se va a visualizar en otra pestana
 * @param {int} token
 * @param {string} txt
 * @param {string} filtro
 */
const pdfCarrera = async (token, txt, filtro) => {
  txt = txt.replace(/\s+/g, "%20")
  let get = {
    method: "GET",
    headers: {},
  }
  // ContentType: cors

  get = AuthPostBasics(token, get)
  const jsonData = require("../../../variables.json")
  let url = ""
  if (filtro === "AllCarrera") {
    url = jsonData.host + urls[filtro]
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

export default pdfCarrera

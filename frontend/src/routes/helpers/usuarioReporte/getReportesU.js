import AuthPostBasics from "../Auth/AuthPostBasis.js"
const getReportesU = async (token) => {
  let post = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  post = AuthPostBasics(token, post)
  const jsonData = require("../../../variables.json")
  const url = jsonData.host + "reporte/get-generan"
  const res = await fetch(url, post)
  const result = await res.json()
  return result
}

export default getReportesU

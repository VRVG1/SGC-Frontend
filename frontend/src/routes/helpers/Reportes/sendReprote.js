import AuthPostBasics from "../Auth/AuthPostBasis.js"

const sendAsigna = async (token, id) => {
  let post = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }
  post = AuthPostBasics(token, post)
  const jsonData = require("../../../variables.json")
  const res = await fetch(jsonData.host + "reporte/send-genera/" + id, post)
  const result = res.statusText
  return result
}

export default sendAsigna

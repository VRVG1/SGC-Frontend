import AuthPostBasis from "../Auth/AuthPostBasis.js"

const urls = {
    getGroups: "reporte/getMailGroups",
    newGroup: "reporte/addMailGroup",
    updateGroup: "reporte/updateMailGroup",
    deleteGroup: "reporte/deleteMailGroup",
    mailGroup: "reporte/sendMailToGroup"
}

const filtroAdmin = async (token, dato, filtro) => {
    let requestBody = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    requestBody = AuthPostBasis(token, requestBody);
    const jsonData = require("../../../variables.json");
    let url = "";
    if (filtro === "getGroups") {
        // No se hace nada, ya que es un get, se mantiene el cuerpo de
        // requestBody
    } else if (filtro === "newGroup" ||
               filtro === "mailGroup" ||
               filtro === "updateGroup" ||
               filtro === "deleteGroup") {
        requestBody.method = "POST";
        requestBody.body = JSON.stringify(dato);
    }
    url = jsonData.host + urls[filtro];

    const res = await fetch(url, requestBody);
    return res;
}

export default filtroAdmin;

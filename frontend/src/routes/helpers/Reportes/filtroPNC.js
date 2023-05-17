import AuthPostBasis from "../Auth/AuthPostBasis.js"

const urls = {
    getRegistro: "reporte/getPNC",
    agregar: "reporte/addPNC",
    modificar: "reporte/updatePNC",
    eliminar: "reporte/deletePNC"
}

const filtroPNC = async (token, dato, filtro) => {
    let get = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    get = AuthPostBasis(token, get);
    const jsonData = require("../../../variables.json");
    let url = "";
    if (filtro === "getRegistro") {
        get.method = "GET";
    } else if (filtro === "agregar" ||
               filtro === "modificar" ||
               filtro === "eliminar") {
        get.method = "POST";
        get.body = JSON.stringify(dato);
    }
    url = jsonData.host + urls[filtro];

    const res = await fetch(url, get);
    return res;
}

export default filtroPNC;

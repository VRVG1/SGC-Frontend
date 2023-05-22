import AuthPostBasis from "../Auth/AuthPostBasis.js"

const urls = {
    "getProfesores": "usuario/p2MaeXC/",
    "getRegistro": "reporte/getVGC/",
    "getAsignaturas": "materia/p2MatXM/"
};

const filtroVerificacionGC = async(token, dato, filtro) => {
    let get = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    get = AuthPostBasis(token, get);
    const jsonData = require("../../../variables.json");
    let url = "";
    if (filtro === "getProfesores" ||
        filtro === "getRegistro" ||
        filtro === "getAsignaturas") {
        url = jsonData.host + urls[filtro] + dato;
    }
    console.log(`URL Filtrado: ${url}`);

    const res = await fetch(url, get);
    return res;
}

export default filtroVerificacionGC;

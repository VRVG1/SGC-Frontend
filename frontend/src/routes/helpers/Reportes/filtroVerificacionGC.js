import AuthPostBasis from "../Auth/AuthPostBasis.js"

const urls = {
    "getTemas": "reporte/p3RepUXCXMaeXMatXGraXGrp/",
    "getProfesores": "usuario/p2MaeXC/",
    "getRegistro": "reporte/getVGC/",
    "getAsignaturas": "materia/p2MatXM/",
    "agregar": "reporte/addVGC/",
    "modificar": "reporte/updateVGC/",
    "eliminar": "reporte/deleteVGC/",
    "descargar": "reporte/VGC-Excel/"
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
        filtro === "getAsignaturas") {
        url = jsonData.host + urls[filtro] + dato;
    } else if (filtro === "getTemas") {
        const atributoIdCarrera = `ID_Carrera=${dato["ID_Carrera"]}`;
        const atributoNombreMaestro = `Nombre_Maestro=${dato["Nombre_Maestro"]}`;
        const atributoIdMateria = `ID_Materia=${dato["ID_Materia"]}`;
        const atributoGrado = `Grado=${dato["Grado"]}`;
        const atributoGrupo = `Grupo=${dato["Grupo"]}`;
        const cuerpoUrlGet = `${atributoIdCarrera}&${atributoNombreMaestro}&${atributoIdMateria}&${atributoGrado}&${atributoGrupo}`;

        url = `${jsonData.host}${urls[filtro]}${cuerpoUrlGet}`;
    } else if (filtro === "getRegistro" ||
               filtro === "agregar" ||
               filtro === "modificar" ||
               filtro === "eliminar" ||
               filtro === "descargar") {
        const atributoIdCarrera = `ID_Carrera=${dato["academia"]}`;
        const atributoSeguimiento = `Seguimiento_No=${dato["seguimiento_no"]}`;
        const atributoSemana = `Semana=${dato["semana"]}`
        const cuerpoUrlPost = `${atributoIdCarrera}&${atributoSeguimiento}&${atributoSemana}`
        url = `${jsonData.host}${urls[filtro]}${cuerpoUrlPost}`;
    }
    if (filtro === "agregar" ||
        filtro === "modificar" ||
        filtro === "eliminar") {
        get.method = "POST";
        get.body = JSON.stringify(dato["dato"]);
    }
    console.log(`URL Filtrado: ${url}`);

    const res = await fetch(url, get);
    return res;
}

export default filtroVerificacionGC;

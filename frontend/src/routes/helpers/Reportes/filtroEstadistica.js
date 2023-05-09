import AuthPostBasis from "../Auth/AuthPostBasis.js"

const urls = {
    // Listas de datos para ultimo filtro
    maestro: "usuario/p2MaeXC/",    // Obtiene los maestros que tienen materias
                                    // asignadas en la carrera X.

    reportes: "reporte/reportes",   // Obtiene todos los reportes registrados
                                    // en la DB.

    materia: "materia/p2MatXC/",    // Obtiene las materias que tiene la carrera
                                    // X.
    grupo: "materia/getGrupos/",    // Obtiene todos los grupos que pueden ser
                                    // registrados en la DB.
    // Indice reprobación
    IndMaestro: "reporte/p3IndXMae/",   // Obtiene una lista con todas las 
                                        // materias y sus indices
                                        // de reprobación del maestro X.

    IndMateria: "reporte/p3IndXMat/",   // Obtiene una lista con todos los
                                        // maestros y sus indices de
                                        // reprobación relacionados con la
                                        // materia X.

    IndGrupo: "reporte/p3IndXGrp/",     // Obtiene una lista de todos los
                                        // maestros y sus indices de
                                        // reprobación relacionados con el
                                        // grupo X.
    // Entrega de reportes
    IndEntregaReportes: "reporte/p3IndEntRepoXC/",   // Obtiene una lista con
                                                    // el numero de profesores
                                                    // que entregaron a tiempo
                                                    // y tarde el reporte X de
                                                    // la carrera Y.

};

/**
    * La función filtroEstadistico se encarga de realizar un llamado a la
    * API de django con la finalidad de obtener los datos filtrados segun
    * sea el metodo que se le pasa por parametro.
    * @param {int} token
    * @param {string} dato
    * @param {string} filtro
    * @returns Una lista con los datos encontrados en formato de objeto.
    */
const filtroEstadistico = async (token, dato, filtro) => {
    let get = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    get = AuthPostBasis(token, get);
    const jsonData = require("../../../variables.json");
    let url = "";
    if (filtro === "maestro" ||
        filtro === "materia" ||
        filtro === "grupo" ||
        filtro === "IndMaestro" ||
        filtro === "IndMateria" ||
        filtro === "IndGrupo" ||
        filtro === "IndEntregaReportes" ) {
        url = jsonData.host + urls[filtro] + dato;
    } else if (filtro === "reportes") {
        url = jsonData.host + urls[filtro];
    }
    console.log(`URL Filtro: ${url}`);

    const res = await fetch(url,get);
    return res;
    // NOTE: I need know if the server return a 400 status or a 200 status
    // const data = res.json();
    // return data;
}
export default filtroEstadistico

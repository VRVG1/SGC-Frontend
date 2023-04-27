import AuthPostBasis from "../Auth/AuthPostBasis.js"

const urls = {
    Carrera: "usuarios/p2MaeXC/", // Obtiene los maestros que tienen materias
                                  // asignadas en la carrera X.
    // Indice reprobación
    IndMaestro: "", // Obtiene una lista con todas las materias y sus indices
                    // de reprobación del maestro X.
    IndMateria: "", // Obtiene una lista con todos los maestros y sus indices
                    // de reprobación relacionados con la materia X.
    IndGrupo: "",   // Obtiene una lista de todos los maestros y sus indices
                    // de reprobación relacionados con el grupo X.
    // Entrega de reportes
    Puntual: "",    // Obtiene una lista con todos los reportes que fueron
                    // entregados puntualmente por el maestro X.
    Puntual: "",    // Obtiene una lista con todos los reportes que fueron
                    // entregados de forma inpuntual por el maestro X.
}

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
    if (filtro === "Carrera") {
        url = jsonData.host + urls[filtro] + dato;
    } else if (filtro === "IndMaestro" ||
               filtro === "IndMateria" ||
               filtro === "IndGrupo") {
        //TODO: Estilizar la variable url para estos tipos de filtro
    }

    const res = await fetch(url,get);
    return res;
    // NOTE: I need know if the server return a 400 status or a 200 status
    // const data = res.json();
    // return data;
}
export default filtroEstadistico

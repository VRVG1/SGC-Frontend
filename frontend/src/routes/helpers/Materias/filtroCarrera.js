import AuthPostBasics from "../Auth/AuthPostBasis.js";
/**
 * Hace llamado a la base de datos de forma constante enviandole una cadena
 * para que la base de datos filtre segun la opcion seleccionada, en este caso
 * materias por carrera
 * @param {int} token
 * @param {string} txt
 * @returns
 */
const filtroCarrera = async (token, txt) => {
  let get = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  get = AuthPostBasics(token, get);
  const jsonData = require("../../../variables.json");
  const url = jsonData.host + "materia/p2MatXC/" + txt;
  const res = await fetch(url, get);
  const data = res.json();
  return data;
};

export default filtroCarrera;

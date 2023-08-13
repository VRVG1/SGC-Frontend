import AuthPostBasics from "../Auth/AuthPostBasis.js";

const postAsigna = async (dataPost, token, user_id) => {
  console.log(dataPost);
  let post = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ID_Materia: dataPost.pik,
      ID_Usuario: user_id,
      Semestre: dataPost.semestre,
      Grupo: dataPost.grupo,
      Hora: dataPost.hora,
      Dia: dataPost.dia,
      Aula: dataPost.aula,
    }),
  };
  post = AuthPostBasics(token, post);
  const jsonData = require("../../../variables.json");
  const res = await fetch(jsonData.host + "materia/asign_materia", post);
  const result = res.statusText;
  return result;
};

export default postAsigna;

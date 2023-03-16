import React, { useState, useEffect, useContext, useCallback } from "react";

import { AuthContext } from "./helpers/Auth/auth-context.js";
import getAllUsuarios from "./helpers/Usuarios/getAllUsuarios.js";
import getAllUnidadesDocente from "./helpers/Unidades/getAllUnidadesDocente.js";
import getInfoUser from "./helpers/Usuarios/getInfoUser";
import Modal from "./modal/Modal.js";
import putReportesUnidad from "./helpers/Reportes/putReportesUnidad.js";
import getRUnidadesAdmin from "./helpers/Reportes/getRUnidadesAdmin.js";

const ReportesMaterias = () => {
  // Inicializacion de variables
  let auth = useContext(AuthContext);
  const [docente, setDocente] = useState([]);
  const [nameDocentes, setNameDocentes] = useState([]);

  //Funciones para obtener datos de la API
  //useEffect principal, aqui se hace llamado a todas la funciones que
  // hacen peticiones a la BD

  useEffect(() => {
    const getReportesUnidades = async () => {
      await getRUnidadesAdmin(auth.user.token)
        .then((data) => {
          if (data.length !== 0) {
            let profesor = data[0].Nombre_Usuario;
            let auxArray = [];
            let finalArray = [];
            data.map((dato) => {
              if (profesor === dato.Nombre_Usuario) {
                auxArray.push(dato);
              } else {
                profesor = dato.Nombre_Usuario;
                finalArray.push(auxArray);
                auxArray = [];
                auxArray.push(dato);
              }
            });
            finalArray.push(auxArray);
            setDocente([...docente, finalArray]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getReportesUnidades();
    return () => {};
  }, []);

  function Card(props) {
    return props.datos.map((item, index) => {
      console.log(item);
      <div key={index}>{item}</div>;
    });
  }

  function Master(props) {
    let resultados = [];
    docente[0].map((item, index) => {
      resultados = <Card datos={item} key={index} />;
    });
    return resultados;
  }
  return (
    <>
      {true ? (
        <>
          <div className="rMateria-container">
            <div className="rContainer-buscar">
              <h1>Reportes Materias</h1>
              <form>
                <div className="rmateria">
                  <input
                    type="text"
                    id="Materia-name"
                    name="Materia_reticula"
                    className="inputMaterias"
                    required
                  />
                  <span className="highlight Materias"></span>
                  <span className="bottomBar Materias"></span>
                  <label className="Materias">Reticula de la Materia</label>
                </div>
              </form>
            </div>
            {Object.keys(docente).length !== 0 ? (
              <>
                {docente[0].map((item, index) => {
                  return (
                    <div className="rMaterias-Maestros" key={index}>
                      <h1>{item[0].Nombre_Usuario}</h1>
                      {item.map((item, index) => {
                        return (
                          <div key={index} className="rmateria-flex">
                            <div className="rmateria-flex-left">
                              <p>{item.Nombre_Materia}</p>
                              <div className="rmateria-title"></div>
                              <div className="rmateria-detalles">
                                <p>{item.Semestre}</p>
                                <p>{item.Grupo}</p>
                                <p>{item.Aula}</p>
                              </div>
                            </div>
                            <div className="rscroll">
                              {item.Generan.map((item, index) => {
                                return (
                                  <div
                                    className="rmateria-flex-right"
                                    key={item.ID_Generacion}
                                  >
                                    <div className="rmateria-unidad-card">
                                      <div className="card-title">
                                        <p>Unidad {item.Unidad}</p>
                                      </div>
                                      <div className="card-body">
                                        <div className="fecha">
                                          <p>
                                            {item.Reprobados === -1
                                              ? "Aun no registrado"
                                              : item.Fecha_Entrega}
                                          </p>
                                        </div>
                                        <div className="reprobados">
                                          <p>
                                            {item.Reprobados === -1
                                              ? ""
                                              : "Indice de reprobados: " +
                                                item.Reprobados +
                                                "%"}
                                          </p>
                                        </div>
                                      </div>
                                      {item.Reprobados === -1 ? (
                                        <></>
                                      ) : (
                                        <>
                                          {" "}
                                          <div className="card-footer">
                                            <button>Dar permiso</button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ReportesMaterias;

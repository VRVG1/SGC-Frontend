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
  const [filtrados, setFiltrados] = useState([]);
  const [nameDocente, setNameDocente] = useState("");
  const [dataSelected, setDataSelected] = useState({
    ID_Generacion: 0,
    Unidad: 0,
    Nombre_Docente: "El Hombre de Somerton",
    Nombre_Materia: "Tamam Shud",
    Fecha_Entrega: "2023-02-14",
    Reprobados: -1,
  });
  const [showModal, setshowModal] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: "Informacion",
    cuerpo:
      "La vida le pregunto a la muerte Porque todos me odian y a ti te aman. Porque yo soy la verdad que no quieren creer, y tu una ilusoria y agradable mentira.",
  });

  //Stilos en linea
  const estiloTexto = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "column",
  };

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
            setFiltrados([...filtrados, finalArray]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getReportesUnidades();
    return () => {};
  }, []);

  /**
   * Obtiene el valor del input buscar, para mostrar solo las coincidencias que se encuentren
   * @param {*} event
   */
  const handleOnChange = (event) => {
    var filtrados = [];
    docente.map((user) => {
      filtrados.push(
        user.map((item) => {
          if (
            item[0].Nombre_Usuario.toLowerCase().includes(
              event.target.value.toLowerCase()
            )
          ) {
            return item;
          }
        })
      );
    });
    filtrados.filter((elemento) => {
      filtrados = elemento.filter((item) => {
        return item !== undefined;
      });
      //return elemento !== undefined;
    });
    setFiltrados([filtrados]);
  };

  /**
   * Realiza la accion de realizar una peticion post a la base de datos para subir el reporte unidad que el profe selecciono
   */
  const subirReporte = async () => {
    await putReportesUnidad(auth.user.token, dataSelected)
      .then((res) => {
        if (res === "OK") {
          setModalInfo({
            title: "Permiso autorizado",
            cuerpo: "Ahora el docente puede volver a subir el reporte",
          });
        } else {
          setModalInfo({
            title: "Error",
            cuerpo: "No se logro dar permiso, intente mas tarde",
          });
        }
        //window.location.href = window.location.href;
      })
      .catch((err) => {
        console.log(err);
      });
    setshowModal(false);
    setShowModalInfo(true);
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 3000);
  };

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
                    onChange={handleOnChange}
                    required
                  />
                  <span className="highlight Materias"></span>
                  <span className="bottomBar Materias"></span>
                  <label className="Materias">Reticula de la Materia</label>
                </div>
              </form>
            </div>
            {Object.keys(filtrados).length !== 0 ? (
              <>
                {filtrados[0].map((item, index) => {
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
                              {item.Generan.map((uni, index) => {
                                return (
                                  <div
                                    className="rmateria-flex-right"
                                    key={uni.ID_Generacion}
                                  >
                                    <div className="rmateria-unidad-card">
                                      <div className="card-title">
                                        <p>Unidad {uni.Unidad}</p>
                                      </div>
                                      <div className="card-body">
                                        <div className="fecha">
                                          <p>
                                            {item.Reprobados === -1
                                              ? "Aun no registrado"
                                              : uni.Fecha_Entrega}
                                          </p>
                                        </div>
                                        <div className="reprobados">
                                          <p>
                                            {uni.Reprobados === -1
                                              ? ""
                                              : "Indice de reprobados: " +
                                                uni.Reprobados +
                                                "%"}
                                          </p>
                                        </div>
                                      </div>
                                      {uni.Reprobados === -1 ? (
                                        <></>
                                      ) : (
                                        <>
                                          {" "}
                                          <div className="card-footer">
                                            <button
                                              onClick={() => {
                                                setDataSelected({
                                                  ...dataSelected,
                                                  ID_Generacion:
                                                    uni.ID_Generacion,
                                                  Unidad: uni.Unidad,
                                                  Nombre_Docente:
                                                    item.Nombre_Usuario,
                                                  Nombre_Materia:
                                                    item.Nombre_Materia,
                                                });
                                                setshowModal(true);
                                              }}
                                            >
                                              Dar permiso
                                            </button>
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
          <Modal
            show={showModal}
            setShow={setshowModal}
            title={"Permitir Modificacion"}
          >
            <div className="Modal2">
              <div className="Texto-Modal-ReportesMaterias" style={estiloTexto}>
                <p>
                  Seguro que desea dar acceso de modificacion al profesor
                  <strong>{" " + dataSelected.Nombre_Docente}</strong>
                  <br />
                  en la materia <strong>
                    {dataSelected.Nombre_Materia}
                  </strong>{" "}
                  en la <strong>Unidad {dataSelected.Unidad}</strong>
                </p>
                <div
                  className="ffff"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5%",
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <button onClick={subirReporte}>Aceptar</button>
                  <button
                    onClick={() => {
                      setshowModal(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            show={showModalInfo}
            setShow={setShowModalInfo}
            title={modalInfo.title}
          >
            <div
              style={{
                wordWrap: "break-word",
                width: "40vw",
                textAlign: "center",
              }}
            >
              <strong>
                <p>{modalInfo.cuerpo}</p>
              </strong>
            </div>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ReportesMaterias;

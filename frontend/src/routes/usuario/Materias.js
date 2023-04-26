import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../helpers/Auth/auth-context.js";
import getAllUnidadesDocente from "../helpers/Unidades/getAllUnidadesDocente.js";
import getInfoUser from "../helpers/Usuarios/getInfoUser";
import Modal from "../modal/Modal.js";
import putReportesUnidad from "../helpers/Reportes/putReportesUnidad.js";

const Materias = () => {
  let auth = useContext(AuthContext);

  const [infoUser, setinfoUser] = useState([]);
  const [materiaD, setmateriaD] = useState([]);
  const [unidadesD, setunidadesD] = useState([]);
  const [dataSelected, setDataSelected] = useState({
    Fecha_Entrega: "",
    ID_Generacion: 0,
    Reprobados: 0,
    Unidad: 0,
    Nombre_Materia: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModalError, setShowModalError] = useState(false);

  /**
   * Obtiene los datos del docente, los cuales se usan para tener el id del docente
   * Claro esta que esta de mas los otros atributos.
   */
  useEffect(() => {
    const getInforUser = async () => {
      await getInfoUser(auth.user.token)
        .then((data) => {
          setinfoUser({
            ...infoUser,
            username: data.username,
            CorreoE: data.CorreoE,
            Nombre_Usuario: data.Nombre_Usuario,
            PK: data.PK,
          });
        })
        .catch((err) => {
          //console.log(err);
        });
    };
    getInforUser();
    return () => {};
  }, []);

  /**
   * Se obtienen las materias las cuales imparte un docente, esta informacion se separa
   * en dos arreglos para tener por un lado las materias y por el otro las unidades de esta
   * se hizo de este modo ya que cada unidad tiene un id de reporte el cual es unico y son
   * generado automaticamente
   */
  useEffect(() => {
    const getAllUnidadesDocentes = async (PK) => {
      await getAllUnidadesDocente(auth.user.token, PK)
        .then((data) => {
          let uni = 0;
          let cont = 0;
          let arrayAux = [];
          let materia3 = "";
          data.map((materia) => {
            if (materia.Unidades !== undefined) {
              materia3 = materia.Nombre_Materia;
              let auxSi = {
                Nombre_Materia: materia.Nombre_Materia,
                Semestre: materia.Semestre,
                Grupo: materia.Grupo,
                Aula: materia.Aula,
                Unidades: materia.Unidades,
              };
              uni = materia.Unidades;
              setmateriaD((materiaD) => [...materiaD, auxSi]);
            } else {
              let aux = {};
              if (materia.Reprobados === -1) {
                aux = {
                  Fecha_Entrega: "",
                  ID_Generacion: materia.ID_Generacion,
                  Reprobados: "",
                  Unidad: materia.Unidad,
                  Nombre_Materia: materia3,
                };
              } else {
                aux = {
                  Fecha_Entrega: materia.Fecha_Entrega,
                  ID_Generacion: materia.ID_Generacion,
                  Reprobados: materia.Reprobados,
                  Unidad: materia.Unidad,
                  Nombre_Materia: materia3,
                };
              }
              cont += 1;
              arrayAux.push(aux);
              if (cont === uni) {
                setunidadesD((unidadesD) => [...unidadesD, arrayAux]);
                arrayAux = [];
                cont = 0;
              }
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (infoUser.length === undefined) {
      getAllUnidadesDocentes(infoUser.PK);
    }
    return () => {};
  }, [infoUser]);

  /**
   * Realiza la accion de realizar una peticion post a la base de datos para subir el reporte unidad que el profe selecciono
   */
  const subirReporte = async () => {
    await putReportesUnidad(auth.user.token, dataSelected)
      .then((res) => {
        //console.log(res)
        window.location.href = window.location.href;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Obtenemos el event del boton para que asi podamos identificar cual unidad es la que se usa para guardar los datos
   * @param {props} event
   */
  const handleOnChange = (event) => {
    setDataSelected({
      ...dataSelected,
      [event.target.id]: event.target.value,
      ID_Generacion: event.target.getAttribute("a-key"),
    });
  };

  const agregarReprobados = (id, unidad) => {
    setDataSelected({
      ...dataSelected,
      ID_Generacion: id,
      Unidad: unidad,
    });
    setShowModal(true);
  };
  return (
    <>
      {true ? (
        <>
          {Object.keys(materiaD).length !== 0 ? (
            materiaD.map((datos, index) => {
              return (
                <div className="Materia-container" key={datos.Nombre_Materia}>
                  <div className="materia-flex">
                    <div className="materia-flex-left">
                      <div className="materia-title">
                        <p>{datos.Nombre_Materia}</p>
                      </div>
                      <div className="materia-detalles">
                        <p>{datos.Semestre}</p>
                        <p>{datos.Grupo}</p>
                        <p>{datos.Aula}</p>
                      </div>
                    </div>
                    <div className="scroll">
                      {Object.keys(unidadesD).length !== 0 ? (
                        unidadesD[index] !== undefined ? (
                          unidadesD[index].map((datos) => {
                            if (
                              datos.Reprobados !== "" &&
                              datos.Fecha_Entrega !== ""
                            ) {
                              return (
                                <div
                                  className="materia-flex-right"
                                  key={datos.ID_Generacion}
                                >
                                  <div className="materia-unidad-card">
                                    <div className="card-title">
                                      <p>Unidad {datos.Unidad}</p>
                                    </div>
                                    <div className="card-body">
                                      <div className="fecha">
                                        <p>{datos.Fecha_Entrega}</p>
                                      </div>
                                      <div className="reprobados">
                                        <p>
                                          Indice de reprobados:{" "}
                                          {datos.Reprobados}%
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  className="materia-flex-right"
                                  key={datos.ID_Generacion}
                                >
                                  <div className="materia-unidad-card">
                                    <div className="card-title">
                                      <p>Unidad {datos.Unidad}</p>
                                    </div>
                                    <div className="card-footer">
                                      <button
                                        onClick={() => {
                                          setDataSelected({
                                            ...dataSelected,
                                            ID_Generacion: datos.ID_Generacion,
                                            Unidad: datos.Unidad,
                                            Nombre_Materia:
                                              datos.Nombre_Materia,
                                            Fecha_Entrega: "",
                                            Reprobados: "",
                                          });
                                          setShowModal(true);
                                        }}
                                      >
                                        {" "}
                                        Agregar{" "}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          })
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
          <Modal
            show={showModal}
            setShow={setShowModal}
            title={dataSelected.Nombre_Materia}
          >
            <div className="Modal-Input">
              <h5>Unidad {dataSelected.Unidad}</h5>
              <div className="fecha">
                <p>
                  Fecha:
                  <input
                    a-key={dataSelected.ID_Generacion}
                    id={"Fecha_Entrega"}
                    type={"date"}
                    onChange={handleOnChange}
                    value={dataSelected.Fecha_Entrega}
                  ></input>
                </p>
              </div>
              <div className="reprobados">
                <p>
                  Indice de reprobados:
                  <input
                    a-key={dataSelected.ID_Generacion}
                    id={"Reprobados"}
                    onChange={handleOnChange}
                    type={"number"}
                    min={"0"}
                    max={"100"}
                    value={dataSelected.Reprobados}
                  ></input>
                </p>
              </div>
              <button
                onClick={() => {
                  if (
                    dataSelected.Reprobados !== "" &&
                    dataSelected.Fecha_Entrega !== ""
                  ) {
                    setShowModal2(true);
                    setShowModal(false);
                  } else {
                    setShowModalError(true);
                  }
                }}
              >
                Guardar
              </button>
            </div>
          </Modal>
          <Modal
            show={showModal2}
            setShow={setShowModal2}
            title={"Datos Guardados"}
          >
            <div className="Modal2">
              <h5>Los datos se han guardado exitosamente</h5>
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowModal2(false);
                  subirReporte();
                }}
              >
                Aceptar
              </button>
            </div>
          </Modal>

          <Modal
            show={showModalError}
            setShow={setShowModalError}
            title={"Datos Incompletos"}
          >
            <div className="Modal2">
              <h5>Es obligatorio llenar todos los datos</h5>
              <button
                onClick={() => {
                  setShowModalError(false);
                }}
              >
                Aceptar
              </button>
            </div>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Materias;

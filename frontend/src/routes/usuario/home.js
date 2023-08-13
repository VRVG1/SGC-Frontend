//TODO, si el mai se equivoca y tiene que modificar las materias
//Pedirle a la base de datos que me mande los datos que el selecciono y agregarlo a la tabla
import React, { useState, useEffect, useContext, useCallback } from "react"
import getAllCarrera from "../helpers/Carreras/getAllCarrera"
import getAllMaterias from "../helpers/Materias/getAllMaterias"
import postAsigna from "../helpers/Asignan/postAsignan.js"
import getAllAsignanUser from "../helpers/Asignan/getAllAsignanUser.js"
import asignanCNames_allpk from "../helpers/Asignan/asignanCNames-allpk"
import deleteAsignacion from "../helpers/Asignan/deleteAsignacion.js"
import { AuthContext } from "../helpers/Auth/auth-context"
import Modal from "../modal/Modal"
import getInfoUser from "../helpers/Usuarios/getInfoUser"
import getMateriaXCarrera from "../helpers/Materias/getCarreraIDMaterias"

export const Home2 = () => {
  let auth = useContext(AuthContext)
  const [infoUser, setInfoUser] = useState([])
  const [disponible, setDisponible] = useState(true)
  const [carreras, setCarreras] = useState([])
  const [aBorrar, setABorrar] = useState([])
  const [materias, setMaterias] = useState([])
  const [allmaterias, setallmaterias] = useState([])
  const [asignanMaterias, setAsignanMaterias] = useState([])
  const [showModalAlert, setShowModalAlert] = useState(false)
  const [mensajeAlerta, setMensajeAlerta] = useState("")
  const [showModalConfirm, setShowModalConfirm] = useState(false)
  const [showModalDatosEnviados, setShowModalDatosEnviados] = useState(false)
  const [send, setSend] = useState(false)
  const [continuacion, setContinuacion] = useState(0)
  const [boraccion, setBoraccion] = useState(0)
  const [selectedData, setSelectedData] = useState({
    carrera_ID: "",
    Clave_reticula: "",
    grupo: "",
    semestre: "",
    dia: "",
    hora: "",
    aula: "",
    Nombre_Carrera: "",
    Nombre_Materia: "",
    pik: "",
  })
  const [dataTable, setDataTable] = useState([])
  let date = new Date()
  let hour = date.getHours()
  const [regex, setRegex] = useState({
    aula: /^[a-z]{0,1}[0-9]{0,2}$/,
  })

  /**
   * Hacer el llamado al los helper para obtener las carreras y materias
   *
   */
  useEffect(() => {
    const obtenerMateria = async () => {
      await getAllMaterias(auth.user.token).then((data) => {
        setallmaterias([
          {
            Carrera: "",
            Clave_reticula: "",
            Nombre_Materia: "",
            pik: "",
          },
          ...data,
        ])
      })
    }
    const obtenerCarrera = async () => {
      await getAllCarrera(auth.user.token).then((data) => {
        setCarreras([
          {
            ID_Carrera: "",
            Nombre_Carrera: "",
          },
          ...data,
        ])
      })
    }

    getInforUser()
    obtenerCarrera()
    obtenerMateria()
    return () => {
      setCarreras([])
      setallmaterias([])
      setInfoUser([])
    }
  }, [])

  useEffect(() => {
    //getAsignan();
    const pinga2 = async () => {
      if (infoUser.PK !== undefined) {
        // Pendejo Victor aqui hay que agregar el pik
        // ID_Materia seria el pik
        await asignanCNames_allpk(auth.user.token, infoUser.PK)
          .then((data) => {
            setAsignanMaterias(data)
          })
          .catch((err) => {
            //console.log(err);
          })
      }
    }
    pinga2()
    return () => {
      setAsignanMaterias([])
    }
  }, [infoUser])

  useEffect(() => {
    if (asignanMaterias.length > 0) {
      asignanMaterias.map((data) => {
        const data2 = [
          {
            carrera_ID: data.ID_Carrera,
            pik: data.ID_Materia,
            grupo: data.Grupo,
            semestre: data.Semestre,
            dia: data.Dia,
            aula: data.Aula,
            hora: data.Hora,
            Nombre_Carrera: data.Carrera,
            Nombre_Materia: data.Nombre_Materia,
          },
        ]
        setDataTable((oldArray) => [...oldArray, ...data2])
      })
    }
  }, [asignanMaterias])
  /**
   * Funcion para obtener los asignan del docente
   */
  const getAsignan = useCallback(async () => {
    if (infoUser.PK !== undefined) {
      await getAllAsignanUser(auth.user.token, infoUser.PK)
        .then((data) => {
          console.log(data)
          setAsignanMaterias(data)
        })
        .catch((err) => {
          //console.log(err);
        })
    }
  }, [infoUser])
  /**
   * Funcion para obtener los datos del usuario
   */
  const getInforUser = useCallback(async () => {
    await getInfoUser(auth.user.token)
      .then((data) => {
        setInfoUser(data)
      })
      .catch((err) => {
        //console.log(err);
      })
  }, [])

  const deleteAsignan = async (PK) => {
    await deleteAsignacion(auth.user.token, PK)
      .then(() => {
        console.log("Se elimino correctamente")
      })
      .catch((err) => {
        console.log(err)
      })
  }

  /**
   * Metodo para obtener los datos que se selecciones de los inputs
   * @param {*} e
   */
  const handleChange = (e) => {
    if (e.target.value.match(regex[e.target.name]) != null) {
      if (e.target.name === "carrera_ID") {
        setSelectedData({
          ...selectedData,
          [e.target.name]: e.target.value,
          Nombre_Carrera: getCarreraName(e.target.value),
        })
      } else if (e.target.name === "Clave_reticula") {
        let ayuda = getMateriaName(e.target.value)
        setSelectedData({
          ...selectedData,
          [e.target.name]: e.target.value,
          Nombre_Materia: ayuda[0],
          pik: ayuda[1],
        })
      } else {
        setSelectedData({
          ...selectedData,
          [e.target.name]: e.target.value,
        })
      }
    }
  }

  /**
   * Metodo para obtener los datos que se selecciones de los inputs
   * y agregarlos a la tabla
   * @returns null
   */
  const agregarTabla = () => {
    let yaEsta = false
    // Por si hace falta, poner en el if de abajo || selectedData.Clave_reticula === ''
    if (
      selectedData.carrera_ID === "" ||
      selectedData.grupo === "" ||
      selectedData.semestre === "" ||
      selectedData.aula === "" ||
      selectedData.dia === "" ||
      selectedData.hora === "" ||
      selectedData.Clave_reticula === ""
    ) {
      setShowModalAlert(true)
      setMensajeAlerta("Todos los campos son obligatorios")
      return
    }

    dataTable.map((data) => {
      //Por si hace falta, poner en el if de abajo && data.Clave_reticula === selectedData.Clave_reticula
      if (
        data.carrera_ID === selectedData.carrera_ID &&
        data.grupo === selectedData.grupo &&
        data.semestre === selectedData.semestre &&
        data.aula === selectedData.aula &&
        data.hora === selectedData.hora &&
        data.dia === selectedData.dia &&
        data.pik === selectedData.Clave_reticula
      ) {
        yaEsta = true
        setShowModalAlert(true)
        setMensajeAlerta("Ya se a asignaron esos datos")
        return
      }
    })
    if (!yaEsta) {
      setDataTable([...dataTable, selectedData])
    }
  }
  /**
   * Metodo para hacer la confirmacion de los datos
   * No envia nada aunque se llame sendData
   */
  const sendData = () => {
    if (dataTable.length > 0) {
      setShowModalConfirm(true)
    } else {
      setShowModalAlert(true)
      setMensajeAlerta("No hay datos para enviar")
    }
  }
  /**
   * Metodo para iniciar el filtado de los datos y enviar/borrar datos en la base de datos
   */
  const pinga = async () => {
    let aux = aBorrar
    dataTable.map(async (data) => {
      aux.map((auxiliar) => {
        if (
          auxiliar.carrera_ID === data.carrera_ID &&
          auxiliar.pik === data.Clave_reticula &&
          auxiliar.grupo === data.grupo &&
          auxiliar.semestre === data.semestre &&
          auxiliar.dia === data.dia &&
          auxiliar.aula === data.aula &&
          auxiliar.hora === data.hora
        ) {
          aux.splice(aux.indexOf(auxiliar), 1)
        }
      })
    })
    setABorrar(aux)
    setBoraccion(Math.random())
    setSend(true)
  }

  const borrar = async () => {
    if (aBorrar.length > 0) {
      aBorrar.map(async (data) => {
        let a
        try {
          a = asignanMaterias.filter(
            (datos) =>
              data.pik === datos.ID_Materia &&
              data.Nombre_Carrera === datos.Carrera &&
              data.Nombre_Materia === datos.Nombre_Materia &&
              data.aula === datos.Aula &&
              data.carrera_ID === datos.ID_Carrera &&
              data.dia === datos.Dia &&
              data.grupo === datos.Grupo &&
              data.hora === datos.Hora &&
              data.semestre === datos.Semestre
          )[0].ID_Asignan
          deleteAsignan(a)
        } catch (error) {
          console.log(error)
        }
      })
    }
  }
  useEffect(() => {
    if (aBorrar.length > 0 && send) {
      borrar()
    }
    setContinuacion(Math.random())
  }, [aBorrar, boraccion])

  /**
   * useEffect para actualizar el selector de materia dependiendo de la carrera elegida
   * Se efectual el hook cuando se actualizar la variable selectedData.carrera_ID
   */
  useEffect(() => {
    const getMateria = async () => {
      if (selectedData.carrera_ID !== "") {
        await getMateriaXCarrera(auth.user.token, selectedData.carrera_ID)
          .then((data) => {
            setMaterias(data)
            let ayuda = getMateriaName(data[0].Clave_reticula)
            setSelectedData({
              ...selectedData,
              Clave_reticula: data[0].Clave_reticula,
              Nombre_Materia: ayuda[0],
              pik: ayuda[1],
            })
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        setMaterias([])
      }
    }

    getMateria()
  }, [selectedData.carrera_ID])
  useEffect(() => {
    if (continuacion !== 0 && send) {
      if (asignanMaterias.length > 0) {
        let aguardar = false
        dataTable.map(async (data) => {
          aguardar = false
          asignanMaterias.map(async (data2) => {
            if (
              data.carrera_ID === data2.ID_Carrera &&
              data.pik === data2.Clave_reticula &&
              data.grupo === data2.Grupo &&
              data.semestre === data2.Grado.toString() &&
              data.dia === data2.dia &&
              data.aula === data2.aula &&
              data.hora === data2.hora
            ) {
              aguardar = false
            } else {
              aguardar = true
            }
          })
          if (aguardar) {
            await postAsigna(data, auth.user.token, infoUser.PK)
          }
        })
      } else {
        dataTable.map(async (data) => {
          await postAsigna(data, auth.user.token, infoUser.PK)
        })
      }
      setShowModalDatosEnviados(true)
    }
  }, [continuacion])
  /**
   * Metodo para enviar los datos a la base de datos
   */
  const mandarDatos = async () => {
    await pinga()
  }
  /**
   * Metodo para finalizar el proceso de seleccion de materias
   */
  const todoListo = () => {
    setShowModalDatosEnviados(false)
    setDisponible(false)
  }
  /**
   * Metodo para conseguir la fecha y mandar el saludo
   * @returns {JSX}
   */
  const Saludo = () => {
    let saludo
    if (hour >= 6 && hour < 12) {
      saludo = (
        <>
          <h1>Buenos días {infoUser.Nombre_Usuario}</h1>
        </>
      )
    } else if (hour >= 12 && hour < 18) {
      saludo = (
        <>
          <h1>Buenas tardes {infoUser.Nombre_Usuario}</h1>
        </>
      )
    } else {
      saludo = (
        <>
          <h1>Buenas noches {infoUser.Nombre_Usuario}</h1>
        </>
      )
    }
    return saludo
  }

  const getMateriaName = (data) => {
    let si = allmaterias.filter((materia) => materia.Clave_reticula === data)
    if (si.length !== 0) {
      return [si[0].Nombre_Materia, si[0].pik]
    } else {
      return ""
    }
  }

  const getCarreraName = (data) => {
    let si = carreras.filter((carrera) => carrera.ID_Carrera === data)
    if (si.length !== 0) {
      return si[0].Nombre_Carrera
    } else {
      return ""
    }
  }

  return (
    <div className="usuario-container-parent">
      <div className="usuario-container">
        <Saludo />
        <h1>Bienvenido al Sistema de Gestión del Curso</h1>
      </div>
      {
        /* Div para la seleccion de materias */
        disponible === infoUser.Permiso ? (
          <>
            <div className="usuario-container">
              <div className="usuario-grid">
                <div className="usuario-grid__1">
                  <div className="tabla-usr">
                    <table>
                      <thead>
                        <tr>
                          <th>Carrera</th>
                          <th>Materia</th>
                          <th>Grupo</th>
                          <th>Semestre</th>
                          <th>Hora</th>
                          <th>Dia</th>
                          <th>Aula</th>
                          <th>Eliminar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataTable.map((data, index) => (
                          <tr key={index}>
                            <td>{data.Nombre_Carrera}</td>
                            <td>{data.Nombre_Materia}</td>
                            <td>{data.grupo}</td>
                            <td>{data.semestre}</td>
                            <td>{data.hora}</td>
                            <td>{data.dia}</td>
                            <td>{data.aula}</td>
                            <td>
                              {" "}
                              <button
                                onClick={() => {
                                  if (
                                    aBorrar.filter(
                                      (data2) =>
                                        data2.carrera_ID === data.carrera_ID &&
                                        data2.Clave_reticula ===
                                          data.Clave_reticula &&
                                        data2.grupo === data.grupo &&
                                        data2.semestre === data.semestre
                                    ).length === 0
                                  ) {
                                    setABorrar([...aBorrar, data])
                                  }
                                  //setABorrar(oldArray => [...oldArray, data]);
                                  setDataTable(
                                    dataTable.filter(
                                      (data) => dataTable[index] !== data
                                    )
                                  )
                                }}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={sendData}>Confirmar</button>
                </div>

                <div className="usuario-grid__2">
                  <div className="form group modal Usuario usr">
                    <select
                      name="carrera_ID"
                      value={selectedData.carrera_ID}
                      onChange={handleChange}
                      className="usuarios-grid-Opcion"
                    >
                      {Object.keys(carreras).length !== 0 ? (
                        carreras.map((carrera) => {
                          return (
                            <option
                              key={carrera.ID_Carrera}
                              value={carrera.ID_Carrera}
                            >
                              {carrera.Nombre_Carrera}
                            </option>
                          )
                        })
                      ) : (
                        <></>
                      )}
                    </select>
                    <span className="highlight Usuarios-usr"></span>
                    <span className="bottomBar Usuarios-usr"></span>
                    <label className="Usuarios-usr">Carrera</label>
                  </div>

                  <div className="form group modal Usuario usr">
                    <select
                      name="Clave_reticula"
                      value={selectedData.Clave_reticula}
                      onChange={handleChange}
                      className="usuarios-grid-Opcion"
                    >
                      {Object.keys(materias).length !== 0 ? (
                        materias.map((materia) => {
                          return (
                            <option
                              key={materia.Clave_reticula}
                              value={materia.Clave_reticula}
                            >
                              {materia.Nombre_Materia}
                            </option>
                          )
                        })
                      ) : (
                        <></>
                      )}
                    </select>
                    <span className="highlight Usuarios-usr"></span>
                    <span className="bottomBar Usuarios-usr"></span>
                    <label className="Usuarios-usr">Materia</label>
                  </div>

                  <div className="form group modal Usuario usr">
                    <select
                      name="grupo"
                      value={selectedData.grupo}
                      onChange={handleChange}
                      className="usuarios-grid-Opcion"
                    >
                      <option value={""}></option>
                      <option value={"A"}>A</option>
                      <option value={"B"}>B</option>
                      <option value={"C"}>C</option>
                      <option value={"D"}>D</option>
                      <option value={"E"}>E</option>
                    </select>
                    <span className="highlight Usuarios-usr"></span>
                    <span className="bottomBar Usuarios-usr"></span>
                    <label className="Usuarios-usr">Grupo</label>
                  </div>

                  <div className="form group modal Usuario usr">
                    <select
                      name="semestre"
                      value={selectedData.semestre}
                      onChange={handleChange}
                      className="usuarios-grid-Opcion"
                    >
                      <option value={""}></option>
                      <option value={"1"}>1</option>
                      <option value={"2"}>2</option>
                      <option value={"3"}>3</option>
                      <option value={"4"}>4</option>
                      <option value={"5"}>5</option>
                      <option value={"6"}>6</option>
                      <option value={"7"}>7</option>
                      <option value={"8"}>8</option>
                      <option value={"9"}>9</option>
                      <option value={"10"}>10</option>
                      <option value={"11"}>11</option>
                      <option value={"12"}>12</option>
                    </select>
                    <span className="highlight Usuarios-usr"></span>
                    <span className="bottomBar Usuarios-usr"></span>
                    <label className="Usuarios-usr">Semestre</label>
                  </div>

                  <div className="form group modal Usuario usr">
                    <select
                      name="hora"
                      value={selectedData.hora}
                      onChange={handleChange}
                      className="usuarios-grid-Opcion"
                    >
                      <option value={""}></option>
                      <option value={"07:00 - 08:00"}>7:00 - 8:00</option>
                      <option value={"08:00 - 09:00"}>8:00 - 9:00</option>
                      <option value={"10:00 - 11:00"}>10:00 - 11:00</option>
                      <option value={"11:00 - 12:00"}>11:00 - 12:00</option>
                      <option value={"12:00 - 13:00"}>12:00 - 13:00</option>
                      <option value={"13:00 - 14:00"}>13:00 - 14:00</option>
                      <option value={"14:00 - 15:00"}>14:00 - 15:00</option>
                      <option value={"07:00 - 09:00"}>7:00 - 9:00</option>
                      <option value={"09:00 - 11:00"}>9:00 - 11:00</option>
                      <option value={"11:00 - 13:00"}>11:00 - 13:00</option>
                      <option value={"13:00 - 15:00"}>13:00 - 15:00</option>
                    </select>
                    <span className="highlight Usuarios-usr"></span>
                    <span className="bottomBar Usuarios-usr"></span>
                    <label className="Usuarios-usr">Hora</label>
                  </div>

                  <div className="form group modal Usuario usr">
                    <select
                      name="dia"
                      value={selectedData.dia}
                      onChange={handleChange}
                      className="usuarios-grid-Opcion"
                    >
                      <option value={""}></option>
                      <option value={"Lunes"}>Lunes</option>
                      <option value={"Martes"}>Martes</option>
                      <option value={"Miercoles"}>Miercoles</option>
                      <option value={"Jueves"}>Jueves</option>
                      <option value={"Viernes"}>Viernes</option>
                    </select>
                    <span className="highlight Usuarios-usr"></span>
                    <span className="bottomBar Usuarios-usr"></span>
                    <label className="Usuarios-usr">Dia</label>
                  </div>

                  <div className="form group modal Usuario usr">
                    <input
                      type="text"
                      id="aula"
                      name="aula"
                      className="usuarios-grid-Opcion"
                      value={selectedData.aula}
                      onChange={handleChange}
                      required
                    />
                    <span className="highlight Usuarios-usr"></span>
                    <span className="bottomBar Usuarios-usr"></span>
                    <label className="Usuarios-usr">Aula</label>
                  </div>

                  <button onClick={agregarTabla}>Agregar</button>
                </div>
              </div>

              <Modal
                show={showModalAlert}
                setShow={setShowModalAlert}
                title={"Advertencia"}
              >
                <p className="alertMSM">{mensajeAlerta}</p>
                <button onClick={() => setShowModalAlert(false)}>
                  Aceptar
                </button>
              </Modal>
              <Modal
                show={showModalConfirm}
                setShow={setShowModalConfirm}
                title={"Confirmación"}
              >
                <p className="alertMSM">
                  Estas seguro que quieres seleccionar estas materias
                </p>
                <div className="tabla-usr">
                  <table>
                    <thead>
                      <tr>
                        <th>Carrera</th>
                        <th>Materia</th>
                        <th>Grupo</th>
                        <th>Semestre</th>
                        <th>Hora</th>
                        <th>Dia</th>
                        <th>Aula</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataTable.map((data, index) => (
                        <tr key={index}>
                          <td>{data.Nombre_Carrera}</td>
                          <td>{data.Nombre_Materia}</td>
                          <td>{data.grupo}</td>
                          <td>{data.semestre}</td>
                          <td>{data.hora}</td>
                          <td>{data.dia}</td>
                          <td>{data.aula}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={mandarDatos}>Confirmar</button>
              </Modal>

              <Modal
                show={showModalDatosEnviados}
                setShow={setShowModalDatosEnviados}
                title={"Datos Enviados"}
              >
                <p className="alertMSM">Materias resgistradas</p>
                <button onClick={todoListo}>Confirmar</button>
              </Modal>
            </div>
          </>
        ) : (
          <></>
        )
      }
    </div>
  )
}

export default Home2

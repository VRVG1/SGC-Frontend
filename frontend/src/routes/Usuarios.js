//TODO: agarrar el Permisos de los usuarios para poner check en el frontend

import React, { useState, useEffect, useContext, useCallback } from "react"
import Modal from "./modal/Modal.js"
import getAllUsuarios from "./helpers/Usuarios/getAllUsuarios.js"
import postUsuario from "./helpers/Usuarios/postUsuario.js"
import putUsuario from "./helpers/Usuarios/putUsuario.js"
import deleteUser from "./helpers/Usuarios/deleteUser.js"
import getCarreras from "./helpers/Carreras/getAllCarrera.js"
import getMaterias from "./helpers/Materias/getAllMaterias.js"
import Loader from "./Loader.js"
import getAsignanC from "./helpers/Asignan/getAsignanC.js"
import kanaBuscar from "../img/kana-buscar.png"
//filtros
import filtroU from "./helpers/Usuarios/filtroU.js"
//PDF Downloader
import pdfUsuario from "./helpers/Usuarios/pdfUsuario.js"

import { AuthContext } from "./helpers/Auth/auth-context.js"

const Usuarios = (props) => {
  let auth = useContext(AuthContext)

  const [userAsignan, setUserAsignan] = useState([])
  const [showModalAdd, setShowModalAdd] = useState(false)
  const [showModalDetails, setShowModalDetails] = useState(false)
  const [showModalModify, setShowModalModify] = useState(false)
  const [showModalAlerta, setShowModalAlerta] = useState(false)
  const [showModalConfirm, setShowModalConfirm] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [loading, setloading] = useState(false)
  const [seleccion, setSeleccion] = useState(false)
  const [showModalResultado, setShowModalResultado] = useState(false)
  const [statusContenido, setStatusContenido] = useState("")
  const [userActualizar, setUserActualizar] = useState("")
  const [userData, setUserData] = useState({})
  const [filtrados, setFiltrados] = useState({})
  const [actualizarUsuario, setActualizarUsuario] = useState(0)
  const [dataInput, setdataInput] = useState({
    PK: "",
    username: "",
    password: "",
    password2: "",
    Nombre_Usuario: "",
    Tipo_Usuario: "Docente",
    CorreoE: "",
    seleccion: false,
  })
  const [userActualizarTitulo, setUserActualizarTitulo] = useState("")
  const [regex, setRegex] = useState({
    PK: /\d+/,
    username: /^[a-zA-Z\d@~._-]{0,20}$/,
    password: /.{0,20}/,
    Nombre_Usuario: /^[A-Za-z\sÀ-ÿ.]{0,100}$/,
    Tipo_Usuario: /.*/,
    CorreoE: /.*/,
  })
  //^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$
  //Regex para validar correos
  const [username, setUsername] = useState("")
  const [Nombre_Usuario, setNombre_Usuario] = useState("")
  const [Tipo_Usuario, setTipo_Usuario] = useState("")
  const [CorreoE, setCorreoE] = useState("")
  const [password, setPassword] = useState("")
  const [pk, setPk] = useState("")

  const [carrera, setCarrera] = useState("")
  const [materia, setMateria] = useState("")

  const [calificacionesData, setCalificacionesData] = useState(userData)

  //useSatate para la funcion buscador
  const [filtroInput, setFiltroInput] = useState("")
  const [placeholder, setPlaceholder] = useState("Nombre de Usuario")
  const [botones, setBotones] = useState(false)
  /**
   * Obtener los asignan de un usuario
   * @param {*} pk
   */
  const getAsignan = async (pk) => {
    let data = await getAsignanC(auth.user.token, pk).then((res) => {
      setUserAsignan(res)
    })
  }
  /**
   * Recibe los datos escritos en un input
   * @param {*} event
   */
  const handleInputOnChange = (event) => {
    if (event.target.value.match(regex[event.target.name]) != null) {
      setdataInput({
        ...dataInput,
        [event.target.name]: event.target.value,
      })
    }
    if (event.target.name === "seleccion") {
      setdataInput({
        ...dataInput,
        [event.target.name]: event.target.checked,
      })
    }
  }
  /**
   * Realiza el cambio de filtrosVariables dependiendo de
   * la opcion elegida, asi como actualizar el estado del boton
   * guardar por dos botones, PDF que descarga el pdf de la busqueda
   * y e boton cancelar que regresa al estado inicial
   * @param {*} event
   */
  const handleRadioOption = async (event) => {
    if (
      event.target.getAttribute("key-name") === "Menor_Indice" ||
      event.target.getAttribute("key-name") === "Mayor_Indice" ||
      event.target.getAttribute("key-name") === "Calificaciones"
    ) {
      let filtradosl = []
      await filtroU(auth.user.token, "", event.target.getAttribute("key-name"))
        .then((data) => {
          filtradosl = data
          setCalificacionesData(filtradosl)
        })
        .catch((err) => {
          filtradosl = userData
        })
      setFiltrados(filtradosl)
    }
    setPlaceholder(event.target.getAttribute("key-name").replace(/_/g, " "))
    setBotones(true)
  }
  /**
   * Metodo para obtener los usuarios desde la base de datos
   */
  const obtenerUsuarios = async () => {
    await getAllUsuarios(auth.user.token).then((data) => {
      setUserData(data)
      setFiltrados(data)
    })
  }

  const getAllMaterias = useCallback(async () => {
    await getMaterias(auth.user.token).then((data) => {
      setMateria(data)
    })
  }, [])

  const getAllCarreras = useCallback(async () => {
    await getCarreras(auth.user.token).then((data) => {
      setCarrera(data)
    })
  }, [])
  /**
   * useEffect para actualizar los datos generales
   */
  useEffect(() => {
    getAllMaterias()
    getAllCarreras()
    obtenerUsuarios()

    return () => {
      setUserData([])
    }
  }, [actualizarUsuario])

  /**
   * useEffect para mostrar mensaje de resultado al momento de agregar
   */
  useEffect(() => {
    if (
      userActualizar === "OK" ||
      userActualizar === "Created" ||
      userActualizar === "Accepted"
    ) {
      setShowModalResultado(true)
      setStatusContenido("Operación realizada con éxito")
      setUserActualizarTitulo("Operación exitosa")
      setActualizarUsuario(Math.random())
    } else if (userActualizar !== "") {
      setShowModalResultado(true)
      setStatusContenido("Favor de revisar el manual de administrador")
      setUserActualizarTitulo("Operación fallida")
      setActualizarUsuario(Math.random())
    }
    setloading(false)
  }, [userActualizar])
  /**
   * Metodo para realizar un post de un usuario nuevo
   */
  const add = async () => {
    setloading(true)
    setUserActualizar(await postUsuario(dataInput, auth.user.token))
  }

  /**
   * Metodo para mostrar el formulario agregar
   */
  const abrirAgregar = () => {
    setdataInput({
      ...dataInput,
      CorreoE: "",
      Nombre_Usuario: "",
      PK: "",
      Tipo_Usuario: "Docente",
      password: "",
      username: "",
      seleccion: true,
    })
    setUserActualizar("")
    setShowModalAdd(true)
  }
  /**
   * Metodo para abrir el formulario de actualizar usuario
   */
  const modifyUser = () => {
    setdataInput({
      ...dataInput,
      CorreoE: CorreoE,
      Nombre_Usuario: Nombre_Usuario,
      Tipo_Usuario: Tipo_Usuario,
      username: username,
      password: "",
      seleccion: true,
    })
    setUserActualizar("")
    setShowModalModify(true)
  }
  /**
   * Metodo para llamar al helper putUsuario y asi modificar los datos de la base de datos
   */
  const modifyUserGuardar = async () => {
    setloading(true)
    setUserActualizar(await putUsuario(dataInput, pk, auth.user.token))
  }
  /**
   * Metodo para eliminar un usuario de la base de datos
   */
  const deleteUserConfirm = async () => {
    setloading(true)
    setUserActualizar(await deleteUser(pk, auth.user.token))
  }
  /**
   *  Metodo para mostrar los detalles del usuario
   * @param {*} id id del usuario a buscar
   */
  function detalles(id) {
    const user = userData.find((elemento) => elemento.PK === id)
    getAsignan(id)
    setCorreoE(user.CorreoE)
    setNombre_Usuario(user.Nombre_Usuario)
    setTipo_Usuario(user.Tipo_Usuario)
    setUsername(user.ID_Usuario.username)
    setPassword(user.ID_Usuario.password)
    setPk(user.PK)
    setSeleccion(user.Permiso)
    setdataInput({
      ...dataInput,
      CorreoE: user.CorreoE,
      Nombre_Usuario: user.Nombre_Usuario,
      Tipo_Usuario: user.Tipo_Usuario,
      username: user.ID_Usuario.username,
      password: "", //No se si poner la contra xd
      password2: "",
      seleccion: user.Permiso,
    })
    setUserActualizar("")
    setShowModalDetails(true)
  }
  /**
   * Metodo para cerra todas los modales
   */
  const closeAll = () => {
    setUserActualizar("")
    setShowModalAdd(false)
    setShowModalResultado(false)
    setShowModalDelete(false)
    setShowModalConfirm(false)
    setShowModalDetails(false)
    setShowModalModify(false)
  }

  const pdfDownload = async () => {
    await pdfUsuario(
      auth.user.token,
      filtroInput,
      placeholder.replace(/\s+/g, "_")
    )
  }
  /**
   * Metodo para buscar en la tabla elementos
   * @param {*} event
   */
  const buscador = async (event) => {
    setFiltroInput(event.target.value)
    let id = event.target.id.replace(/\s+/g, "_")
    let filtradosl
    if (id === "Nombre de Usuario") {
      filtradosl = userData.map((user) => {
        if (
          user.Nombre_Usuario.toLowerCase().includes(
            event.target.value.toLowerCase()
          )
        ) {
          return user
        }
      })
      filtradosl = filtradosl.filter((elemento) => {
        return elemento !== undefined
      })
    } else if (id === "Calificaciones") {
      let si = calificacionesData
      filtradosl = si.map((user) => {
        if (
          user.Nombre_Usuario.toLowerCase().includes(
            event.target.value.toLowerCase()
          )
        ) {
          return user
        }
      })
      filtradosl = filtradosl.filter((elemento) => {
        return elemento !== undefined
      })
    } else {
      await filtroU(auth.user.token, event.target.value.toLowerCase(), id)
        .then((data) => {
          filtradosl = data
        })
        .catch((err) => {
          filtradosl = userData
        })
    }
    setFiltrados(filtradosl)
  }
  /**
   * Metodo para mostrar en los detalles del usuario las materias que este tiene asignadas
   * @param {*} asignan
   */
  const DatosTablaDetalles = () => {
    const datosTabla = []
    userAsignan.map((asigna, index) => {
      datosTabla.push(
        <tr key={index}>
          <td>{asigna.Carrera}</td>
          <td>{asigna.Nombre_Materia}</td>
          <td>{asigna.Semestre}</td>
          <td>{asigna.Grupo}</td>
          <td>{asigna.Hora}</td>
          <td>{asigna.Dia}</td>
          <td>{asigna.Aula}</td>
        </tr>
      )
    })
    // if (tabla.length === 0) {
    //   return <p>No tiene materias asignadas</p>
    // }
    return datosTabla
  }

  const Filtros = () => {
    return (
      <div className="filtros-container">
        <div className="izquierda">
          <input
            type={"radio"}
            id="Filtro-1"
            key-name={"Carrera"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Carrera" === placeholder}
          ></input>
          <label className="label-radio label-1" htmlFor="Filtro-1">
            <div className="punto"></div>
            <span>Carrera</span>
          </label>

          <input
            type={"radio"}
            id="Filtro-2"
            key-name={"Hora"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Hora" === placeholder}
          ></input>
          <label className="label-radio label-2" htmlFor="Filtro-2">
            <div className="punto"></div>
            <span>Hora</span>
          </label>

          <input
            type={"radio"}
            id="Filtro-3"
            key-name={"Calificaciones"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Calificaciones" === placeholder}
          ></input>
          <label className="label-radio label-3" htmlFor="Filtro-3">
            <div className="punto"></div>
            <span>Calificaciones</span>
          </label>
        </div>
        <div className="derecha">
          <input
            type={"radio"}
            id="Filtro-5"
            key-name={"Mayor_Indice"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Mayor Indice" === placeholder}
          ></input>
          <label className="label-radio label-5" htmlFor="Filtro-5">
            <div className="punto"></div>
            <span>Mayor Indice</span>
          </label>
          <input
            type={"radio"}
            id="Filtro-6"
            key-name={"Menor_Indice"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Menor Indice" === placeholder}
          ></input>
          <label className="label-radio label-6" htmlFor="Filtro-6">
            <div className="punto"></div>
            <span>Menor Indice</span>
          </label>
        </div>
      </div>
    )
  }
  const HoraSelect = () => {
    let lista = []
    for (let i = 7; i < 21; i++) {
      if (i === 9) {
        lista.push(
          <option value={"0" + i + ":00 - " + (i + 1) + ":00"}></option>
        )
      } else if (i < 10) {
        lista.push(
          <option value={"0" + i + ":00 - 0" + (i + 1) + ":00"}></option>
        )
      } else {
        lista.push(<option value={i + ":00 - " + (i + 1) + ":00"}></option>)
      }
    }
    for (let i = 7; i < 21; i++) {
      if (i === 9) {
        lista.push(
          <option value={"0" + i + ":00 - " + (i + 2) + ":00"}></option>
        )
      } else if (i < 10) {
        lista.push(
          <option value={"0" + i + ":00 - 0" + (i + 2) + ":00"}></option>
        )
      } else {
        lista.push(<option value={i + ":00 - " + (i + 2) + ":00"}></option>)
      }
      i += 1
    }
    return lista
  }
  const Prueba = () => {
    let sexo = filtrados.map((user) => {
      if (user.Tipo_Usuario === "Docente") {
        return (
          <tr key={user.Nombre_Usuario + user.PK}>
            <td
              onClick={() => {
                detalles(user.PK)
              }}
            >
              {user.Nombre_Usuario}
            </td>
          </tr>
        )
      }
    })
    return sexo
  }

  return (
    <>
      {loading === false ? (
        <div className="containerUsuarios">
          <h1>Usuarios</h1>
          <form>
            <div className="form group modal Usuario">
              {placeholder === "Hora" ? (
                <>
                  <input
                    type="text"
                    list="Hora-list"
                    id={placeholder}
                    name="usuario-name"
                    className="inputUsuarios-search"
                    required
                    onChange={buscador}
                    value={filtroInput}
                  />
                  <datalist id="Hora-list">
                    <HoraSelect />
                  </datalist>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    id={placeholder}
                    name="usuario-name"
                    className="inputUsuarios-search"
                    required
                    onChange={buscador}
                    value={filtroInput}
                  />
                </>
              )}

              <span className="highlight Usuarios"></span>
              <span className="bottomBar Usuarios-main"></span>
              <label className="Usuarios-search">{placeholder}</label>
            </div>
          </form>
          <Filtros />
          <div className="tabla">
            {Object.keys(filtrados).length !== 0 ? (
              <table>
                <tbody>
                  {/* {filtrados.map((user) => {
                    if (user.Tipo_Usuario === "Docente") {
                      return (
                        <tr key={user.PK}>
                          <td
                            onClick={() => {
                              detalles(user.PK)
                            }}
                          >
                            {user.Nombre_Usuario}
                          </td>
                        </tr>
                      )
                    }
                  })} */}
                  <Prueba />
                </tbody>
              </table>
            ) : (
              <>
                <div className="Sin_Resultados">
                  <p className="p">No se encontraron resultados</p>
                </div>
                <div className="Sin_Resultados img">
                  <img src={kanaBuscar} className="kana" alt="Sin resultados" />
                </div>
              </>
            )}
          </div>

          {botones ? (
            <>
              <div className="filtros-botones">
                <input
                  type="submit"
                  className="button Usuarios"
                  value="Descargar"
                  onClick={pdfDownload}
                ></input>
                <input
                  type="submit"
                  className="button Usuarios"
                  value="Cancelar"
                  onClick={() => {
                    setBotones(false)
                    setPlaceholder("Nombre de Usuario")
                    setFiltroInput("")
                    setFiltrados(userData)
                  }}
                ></input>
              </div>
            </>
          ) : (
            <>
              <input
                type="submit"
                className="button Usuarios"
                value="Agregar"
                onClick={abrirAgregar}
              ></input>
            </>
          )}

          {/* Modal detalles */}
          <Modal
            show={showModalDetails}
            setShow={setShowModalDetails}
            title={Nombre_Usuario}
          >
            <div className="containerDetallesUser">
              <form>
                <div className="Inputs">
                  <div className="form group modal Usuario">
                    <input
                      type="text"
                      id="usuario-name"
                      name="Nombre_Usuario"
                      className="inputUsuarios"
                      value={dataInput.Nombre_Usuario}
                      onChange={handleInputOnChange}
                      required
                    />
                    <span className="highlight Usuarios"></span>
                    <span className="bottomBar Usuarios"></span>
                    <label className="Usuarios">Nombre de Usuario</label>
                  </div>

                  <div className="form group modal Usuario">
                    <select
                      name="Tipo_Usuario"
                      onChange={handleInputOnChange}
                      value={dataInput.Tipo_Usuario}
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Docente">Docente</option>
                      <option value="Espectador">Espectador</option>
                    </select>
                    <span className="highlight Usuarios"></span>
                    <span className="bottomBar Usuarios"></span>
                    <label className="Usuarios">Tipo de Usuario</label>
                  </div>

                  <div className="form group modal Usuario">
                    <input
                      type="text"
                      id="usuario-nickname"
                      name="username"
                      value={dataInput.username}
                      onChange={handleInputOnChange}
                      className="inputUsuarios"
                      required
                    />
                    <span className="highlight Usuarios"></span>
                    <span className="bottomBar Usuarios"></span>
                    <label className="Usuarios">Apodo de Usuario</label>
                  </div>

                  <div className="form group modal Usuario">
                    <input
                      type="text"
                      id="usuario-email"
                      name="CorreoE"
                      title="Correo electronico Institucional del ITCG"
                      className="inputUsuarios"
                      value={dataInput.CorreoE}
                      onChange={handleInputOnChange}
                      required
                    />
                    <span className="highlight Usuarios"></span>
                    <span className="bottomBar Usuarios"></span>
                    <label className="Usuarios">Correo de Usuario</label>
                  </div>

                  <div className="form group modal Usuario">
                    <input
                      type="password"
                      id="usuario-password"
                      name="password"
                      onChange={handleInputOnChange}
                      value={dataInput.password}
                      className="inputUsuarios"
                      required
                    />
                    <span className="highlight Usuarios"></span>
                    <span className="bottomBar Usuarios"></span>
                    <label className="Usuarios">
                      Nueva Contraseña de Usuario
                    </label>
                  </div>

                  <div className="form group modal Usuario">
                    <input
                      type="password"
                      id="usuario-password"
                      name="password2"
                      onChange={handleInputOnChange}
                      value={dataInput.password2}
                      className="inputUsuarios"
                      required
                    />
                    <span className="highlight Usuarios"></span>
                    <span className="bottomBar Usuarios"></span>
                    <label className="Usuarios">Confirmar Contraseña</label>
                  </div>
                  <div className="form group modal Usuario">
                    <label className="Usuarios-Detalles">
                      Seleccion de Materias
                    </label>
                    <input
                      type={"checkbox"}
                      className="Usuarios-Detalles checkbox"
                      onChange={handleInputOnChange}
                      name="seleccion"
                      value={dataInput.seleccion}
                      checked={dataInput.seleccion}
                    />
                  </div>
                </div>
              </form>
              <div className="Tablass">
                <div className="tablas">
                  {Object.keys(userAsignan).length !== 0 ? (
                    <>
                      <table>
                        <thead>
                          <tr>
                            <th>Carrera</th>
                            <th>Materias</th>
                            <th>Semestre</th>
                            <th>Grupo</th>
                            <th>Hora</th>
                            <th>Dia</th>
                            <th>Aula</th>
                          </tr>
                        </thead>
                        <tbody>
                          <DatosTablaDetalles />
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      <div className="Sin_Resultados">
                        <p>El docente no tiene materias asignadas</p>
                      </div>
                      <div className="Sin_Resultados img">
                        <img
                          src={kanaBuscar}
                          className="kana"
                          alt="Sin resultados"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="Buttons">
                <div className="Usuarios-Detalles buttons">
                  <input
                    type="submit"
                    className="button Usuarios"
                    value="Modificar"
                    onClick={() => {
                      if (dataInput.password === dataInput.password2) {
                        setShowModalConfirm(true)
                      } else {
                        setShowModalAlerta(true)
                      }
                    }}
                  />
                  <input
                    type="submit"
                    className="button Usuarios delete"
                    value="Eliminar"
                    onClick={() => setShowModalDelete(true)}
                  />
                </div>
              </div>
            </div>
          </Modal>
          {/** Modal add */}
          <Modal
            show={showModalAdd}
            setShow={setShowModalAdd}
            title={"Agregar Usuario"}
          >
            <form>
              <div className="form group modal Usuario">
                <input
                  type="text"
                  id="usuario-name"
                  name="Nombre_Usuario"
                  onChange={handleInputOnChange}
                  value={dataInput.Nombre_Usuario}
                  className="inputUsuarios"
                  required
                />
                <span className="highlight Usuarios"></span>
                <span className="bottomBar Usuarios"></span>
                <label className="Usuarios">Nombre de Usuario</label>
              </div>

              <div className="form group modal Usuario">
                <select
                  name="Tipo_Usuario"
                  onChange={handleInputOnChange}
                  value={dataInput.Tipo_Usuario}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Docente">Docente</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
                <span className="highlight Usuarios"></span>
                <span className="bottomBar Usuarios"></span>
                <label className="Usuarios">Tipo de Usuario</label>
              </div>

              <div className="form group modal Usuario">
                <input
                  type="text"
                  id="usuario-nickname"
                  name="username"
                  onChange={handleInputOnChange}
                  value={dataInput.username}
                  className="inputUsuarios"
                  required
                />
                <span className="highlight Usuarios"></span>
                <span className="bottomBar Usuarios"></span>
                <label className="Usuarios">Apodo de Usuario</label>
              </div>

              <div className="form group modal Usuario">
                <input
                  type="text"
                  id="usuario-email"
                  name="CorreoE"
                  onChange={handleInputOnChange}
                  value={dataInput.CorreoE}
                  title="Correo electronico Institucional del ITCG"
                  className="inputUsuarios"
                  required
                />
                <span className="highlight Usuarios"></span>
                <span className="bottomBar Usuarios"></span>
                <label className="Usuarios">Correo de Usuario</label>
              </div>

              <div className="form group modal Usuario">
                <input
                  type="password"
                  id="usuario-password"
                  name="password"
                  onChange={handleInputOnChange}
                  value={dataInput.password}
                  className="inputUsuarios"
                  required
                />
                <span className="highlight Usuarios"></span>
                <span className="bottomBar Usuarios"></span>
                <label className="Usuarios">Contraseña de Usuario</label>
              </div>
            </form>

            <input
              type="submit"
              className="button Usuarios"
              value="Guardar"
              onClick={add}
            />
          </Modal>
          {/**Modal Delete */}
          <Modal
            show={showModalDelete}
            setShow={setShowModalDelete}
            title={"Eliminar Usuario"}
          >
            <p>
              Realmente esta seguro que quiere eliminar al usuario:{" "}
              <strong className="Resaltado">{Nombre_Usuario}</strong>
            </p>
            <div className="Usuarios-Detalles buttons">
              <input
                type="submit"
                className="button Usuarios"
                value="Calcelar"
                onClick={() => setShowModalDelete(false)}
              />
              <input
                type="submit"
                className="button Usuarios delete"
                value="Confirmar"
                onClick={deleteUserConfirm}
              />
            </div>
          </Modal>
          {/**Modal Confirm */}
          <Modal
            show={showModalConfirm}
            setShow={setShowModalConfirm}
            title={"Modificar"}
          >
            <div className="modal group">
              <p>
                Realmente esta seguro que quiere actualizar los datos del
                usuario:
              </p>
              <br />
              <div className="Usuarios-Detalles summary">
                {Nombre_Usuario === dataInput.Nombre_Usuario ? null : (
                  <p>
                    Nombre del Usuario pasara de:{" "}
                    <strong className="Resaltado">{Nombre_Usuario}</strong> a{" "}
                    <strong className="Resaltado">
                      {dataInput.Nombre_Usuario}
                    </strong>
                  </p>
                )}
                {Tipo_Usuario === dataInput.Tipo_Usuario ? null : (
                  <p>
                    Tipo de Usuario pasara de:{" "}
                    <strong className="Resaltado">{Tipo_Usuario}</strong> a{" "}
                    <strong className="Resaltado">
                      {dataInput.Tipo_Usuario}
                    </strong>
                  </p>
                )}
                {username === dataInput.username ? null : (
                  <p>
                    Apodo del Usuario pasara de:{" "}
                    <strong className="Resaltado">{username}</strong> a{" "}
                    <strong className="Resaltado">{dataInput.username}</strong>
                  </p>
                )}
                {CorreoE === dataInput.CorreoE ? null : (
                  <p>
                    Correo del Usuario pasara de:{" "}
                    <strong className="Resaltado">{CorreoE}</strong> a{" "}
                    <strong className="Resaltado">{dataInput.CorreoE}</strong>
                  </p>
                )}
                {/* {"" === dataInput.password ? null : <p>Contraseña del Usuario pasara de: <strong className="Resaltado">{password}</strong> a <strong className="Resaltado">{dataInput.password}</strong></p>} */}
                {"" === dataInput.password ? null : (
                  <p>Contraseña del Usuario sera cambiada</p>
                )}
                {seleccion === dataInput.seleccion ? null : (
                  <p>
                    Seleccion del Usuario pasara de:{" "}
                    <strong className="Resaltado">
                      {seleccion.toString()}
                    </strong>{" "}
                    a{" "}
                    <strong className="Resaltado">
                      {dataInput.seleccion.toString()}
                    </strong>
                  </p>
                )}
              </div>
            </div>
            <input
              type="submit"
              className="button Usuarios"
              value="Cancelar"
              onClick={() => setShowModalConfirm(false)}
            />
            <input
              type="submit"
              className="button Usuarios delete"
              value="Confirmar"
              onClick={modifyUserGuardar}
            />
          </Modal>
          {/* Resultado de agregar */}
          <Modal
            show={showModalResultado}
            setShow={setShowModalResultado}
            title={userActualizarTitulo}
          >
            <div className="modal group">
              <p>
                <strong>{statusContenido}</strong>
              </p>
            </div>
            <input
              type="submit"
              className="button Materias"
              onClick={closeAll}
              value="OK"
            />
          </Modal>
          {/* Modal de opciones o el de contra error */}
          <Modal
            show={showModalAlerta}
            setShow={setShowModalAlerta}
            title={"Alerta"}
          >
            <div className="modal group">
              <p>
                <strong>{"Las contraseñas no coinciden"}</strong>
              </p>
            </div>
            <input
              type="submit"
              className="button Materias"
              onClick={() => setShowModalAlerta(false)}
              value="OK"
            />
          </Modal>
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}
export default Usuarios

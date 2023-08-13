//TODO: Agregar el ID para la borracion de materias
import React, { useState, useEffect, useContext } from "react"
import Modal from "./modal/Modal.js"
import getAllCarrera from "./helpers/Carreras/getAllCarrera.js"
import getAllMaterias from "./helpers/Materias/getAllMaterias.js"
import deleteMateria from "./helpers/Materias/deleteMateria.js"
import Loader from "./Loader.js"
import postMateria from "./helpers/Materias/postMateria.js"
import putMateria from "./helpers/Materias/putMateria.js"
//Import filtros
import filtroMat from "./helpers/Materias/filtrosMat.js"
//import PDFDownler
import pdfCarrera from "./helpers/Materias/PDFCarrera.js"

import kanaBuscar from "../img/kana-buscar.png"

import { AuthContext } from "./helpers/Auth/auth-context.js"
/**
 * Componente para la vista de materias
 * @param {*} props
 * @returns componente
 */
const Materias = (props) => {
  let auth = useContext(AuthContext)

  const [showModalAdd, setShowModalAdd] = useState(false)
  const [showModalDetails, setShowModalDetails] = useState(false)
  const [showModalResultado, setShowModalResultado] = useState(false)
  const [showModalModify, setShowModalModify] = useState(false)
  const [showModalConfirm, setShowModalConfirm] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalNoCarreras, setShowModalNoCarreras] = useState(false)
  const [materiaData, setMateriaData] = useState({})
  const [filtrados, setFiltrados] = useState({})
  const [carreraData, setCareraData] = useState({})
  const [addData, setAddData] = useState({
    Materia_name: "",
    Materia_reticula: "",
    Materia_horas_teoricas: "",
    Materia_horas_practicas: "",
    Materia_creditos: "",
    Materia_unidades: "",
    //Nombre_Carrera: ''
  })
  const [regex, setRegex] = useState({
    Materia_name: /^[A-Za-z\sÀ-ÿ]{0,200}$/,
    Materia_reticula: /^[A-Z]{0,3}-{0,1}[0-9]{0,4}$/,
    Materia_horas_teoricas: /^[0-9]{0,2}$/,
    Materia_horas_practicas: /^[0-9]{0,2}$/,
    Materia_creditos: /^[0-9]{0,2}$/,
    Materia_unidades: /^[0-9]{0,2}$/,
    //materia_carrera: '',
  })
  const [actualizarCarrera, setActualizarCarrera] = useState(0)
  const [actualizarMateria, setActualizarMateria] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addMaterias, setAddMaterias] = useState("")
  const [statusContenido, setStatusContenido] = useState("")

  const [Clave_reticula, setClave_reticula] = useState("")
  const [Nombre_Materia, setNombre_Materia] = useState("")
  const [modificaciones, setModificaciones] = useState({
    Materia_name: "",
    Materia_reticula: "",
    Materia_horas_teoricas: "",
    Materia_horas_practicas: "",
    Materia_creditos: "",
    Materia_unidades: "",
    Materia_carrera: "",
    Materia_nombre_carrera: "",
  })

  const [resultadoTitulo, setResultadoTitulo] = useState("")
  const [placeholder, setPlaceholder] = useState("Nombre de Materia")
  const [botones, setBotones] = useState(false)
  const [filtroInput, setFiltroInput] = useState("")

  const [ptio, setPtio] = useState({})
  /**
   * Metodo para obtener todas las materiass
   */
  const obtenerMaterias = () => {
    getAllMaterias(auth.user.token).then((data) => {
      setMateriaData(data)
      setFiltrados(data)
    })
  }

  /**
   * Metodo para obtener todos los datos de la
   * carrera desde la base de datos
   */
  const obtenerCarrera = async () => {
    await getAllCarrera(auth.user.token).then((data) => {
      if (data.length > 0) {
        setCareraData(data)
      }
    })
  }

  /**
   * useEffect para obtener los datos de carrera cada que se actualizen
   */
  useEffect(() => {
    obtenerCarrera()
  }, [actualizarCarrera])
  /**
   * hook useEffect para la recoleccion de datos generales de materias
   */
  useEffect(() => {
    obtenerMaterias()
  }, [actualizarMateria])

  /**
   * Metodo para realizar la accion borrar materia
   */
  const deleteMaterias = async () => {
    setLoading(true)
    setAddMaterias(await deleteMateria(Clave_reticula, auth.user.token))
    setResultadoTitulo("Eliminación")
    setStatusContenido("Eliminación exitosa")
  }

  /**
   * Metodo para abrir la interfaz de modificar
   */
  const modifircar = () => {
    setAddMaterias("")
    setAddData({
      ...addData,
      Materia_name: Nombre_Materia,
      //materia_carrera: ID_Carrera,
      Materia_reticula: Clave_reticula,
      //Nombre_Carrera: Nombre_Carrera
    })
    setShowModalConfirm(false)
    setShowModalModify(true)
    setShowModalDetails(false)
  }
  /**
   * Metodo para realizar la accion modificar
   */
  const confirmModificar = async () => {
    setLoading(true)
    setAddMaterias(await putMateria(addData, Clave_reticula, auth.user.token))
    setStatusContenido("Se ha modificado la materia de manera exitosa")
    setResultadoTitulo("Modificación fue exitosa")
  }

  /**
   * Metodo para mostrar los detalles de una materia
   * @param {int} id  ID de la materia
   */
  function details(id) {
    const materia = materiaData.find(
      (elemento) => elemento.Clave_reticula === id
    )
    const carrera = carreraData.find(
      (element) => element.ID_Carrera === materia.Carrera
    )
    setModificaciones({
      ...modificaciones,
      Materia_name: materia.Nombre_Materia,
      Materia_carrera: carrera.ID_Carrera,
      Materia_reticula: id,
      Materia_nombre_carrera: carrera.Nombre_Carrera,
      Materia_horas_teoricas: materia.horas_Teoricas,
      Materia_horas_practicas: materia.horas_Practicas,
      Materia_creditos: materia.creditos,
      Materia_unidades: materia.unidades,
    })
    setClave_reticula(materia.Clave_reticula)
    setNombre_Materia(materia.Nombre_Materia)
    //setID_Carrera(carrera.ID_Carrera);
    //setNombre_Carrera(carrera.Nombre_Carrera);
    setAddMaterias("")
    setShowModalDetails(true)
    setAddData({
      ...addData,
      Materia_name: materia.Nombre_Materia,
      materia_carrera: carrera.ID_Carrera,
      Materia_reticula: id,
      Nombre_Carrera: carrera.Nombre_Carrera,
      Materia_horas_teoricas: materia.horas_Teoricas,
      Materia_horas_practicas: materia.horas_Practicas,
      Materia_creditos: materia.creditos,
      Materia_unidades: materia.unidades,
    })
    setShowModalConfirm(false)
  }

  /**
   * metodo para limpear los datos de los inputs cada que se presione el boton
   * agregar y de paso muestra el formulario de agregar
   */
  const add = () => {
    // if (carreraData.length > 0) {
    //     setAddData({
    //         ...addData,
    //         Materia_name: '',
    //         //materia_carrera: carreraData[0].ID_Carrera,
    //         Materia_semestre: '',
    //         Materia_grupo: '',
    //         Materia_reticula: '',
    //         //Nombre_Carrera: carreraData[0].Nombre_Carrera
    //     });
    //     setAddMaterias('');
    //     //setActualizarCarrera(Math.random())
    //     setShowModalAdd(true);
    // } else {
    //     setShowModalNoCarreras(true);
    // }
    setAddData({
      ...addData,
      Materia_name: "",
      Materia_reticula: "",
      Materia_horas_teoricas: "",
      Materia_horas_practicas: "",
      Materia_creditos: "",
      Materia_unidades: "",
      //Nombre_Carrera: ''
      materia_carrera: carreraData[0].ID_Carrera,
      Nombre_Carrera: carreraData[0].Nombre_Carrera,
    })
    setAddMaterias("")
    //setActualizarCarrera(Math.random())
    setShowModalAdd(true)
  }
  /**
   * Metodo que tienen como parametro el eventeo del input usado para guardar el valor
   * en su respectiva variable usando useState()
   * @param {*} event
   */
  const handleSelectOnChange = (event) => {
    if (event.target.value.match(regex[event.target.name]) != null) {
      if (event.target.name === "Nombre_Carrera") {
        setPtio({
          ...ptio,
          [event.target.name]: event.target.value,
          materia_carrera: carreraData.find(
            (element) => element.Nombre_Carrera === event.target.value
          ).ID_Carrera,
        })
      }
      setAddData({
        ...addData,
        [event.target.name]: event.target.value,
      })
    }
  }
  useEffect(() => {
    setAddData({
      ...addData,
      materia_carrera: ptio.materia_carrera,
      Nombre_Carrera: ptio.Nombre_Carrera,
    })
    return () => {
      setAddData({})
    }
  }, [ptio])

  /**
   * Metodo para crear un post de materia
   */
  const postermateria = async () => {
    setLoading(true)
    setAddMaterias(await postMateria(addData, auth.user.token))
    setStatusContenido("Se ha agregado la materia correctamente")
    setResultadoTitulo("Materia agregada")
  }

  /**
   * useEffect para mostrar mensaje de resultado al momento de agregar
   */
  useEffect(() => {
    if (addMaterias === "OK") {
      setShowModalResultado(true)
      setActualizarMateria(Math.random())
    } else if (addMaterias !== "") {
      setShowModalResultado(true)
      setStatusContenido(
        "Problemas al realizar la operacion, intente mas tarde"
      )
      setResultadoTitulo("ERROR")
      setActualizarMateria(Math.random())
    }
    setLoading(false)
  }, [addMaterias])

  /**
   * Metodo para cerra todas los modales
   */
  const closeAdd = () => {
    setAddMaterias("")
    setShowModalAdd(false)
    setShowModalResultado(false)
    setShowModalDelete(false)
    setShowModalConfirm(false)
    setShowModalDetails(false)
    setShowModalModify(false)
  }

  /**
   * Metodo para buscar en la tabla elementos
   * @param {*} event
   */
  const buscador = async (event) => {
    setFiltroInput(event.target.value)
    let id = event.target.id
    let filtradosl
    if (id === "Nombre de Materia") {
      filtradosl = materiaData.map((materia) => {
        if (
          materia.Nombre_Materia.toLowerCase().includes(
            event.target.value.toLowerCase()
          )
        ) {
          return materia
        }
      })
      filtradosl = filtradosl.filter((elemento) => {
        return elemento !== undefined
      })
    } else {
      await filtroMat(auth.user.token, event.target.value.toLowerCase(), id)
        .then((data) => {
          filtradosl = data
        })
        .catch((err) => {
          filtradosl = materiaData
        })
    }

    setFiltrados(filtradosl)
  }

  const pdfDownload = async () => {
    await pdfCarrera(auth.user.token, filtroInput, placeholder)
  }

  /**
   * Realiza el cambio de filtrosVariables dependiendo de
   * la opcion elegida, asi como actualizar el estado del boton
   * guardar por dos botones, PDF que descarga el pdf de la busqueda
   * y e boton cancelar que regresa al estado inicial
   * @param {*} event
   */
  const handleRadioOption = (event) => {
    setPlaceholder(event.target.getAttribute("key-name"))
    setBotones(true)
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
            key-name={"Aula"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Aula" === placeholder}
          ></input>
          <label className="label-radio label-3" htmlFor="Filtro-3">
            <div className="punto"></div>
            <span>Aula</span>
          </label>

          <input
            type={"radio"}
            id="Filtro-4"
            key-name={"Grupo"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Grupo" === placeholder}
          ></input>
          <label className="label-radio label-4" htmlFor="Filtro-4">
            <div className="punto"></div>
            <span>Grupo</span>
          </label>
        </div>
        <div className="derecha">
          <input
            type={"radio"}
            id="Filtro-5"
            key-name={"Maestro"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Maestro" === placeholder}
          ></input>
          <label className="label-radio label-5" htmlFor="Filtro-5">
            <div className="punto"></div>
            <span>Maestro</span>
          </label>

          <input
            type={"radio"}
            id="Filtro-6"
            key-name={"Creditos"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Creditos" === placeholder}
          ></input>
          <label className="label-radio label-6" htmlFor="Filtro-6">
            <div className="punto"></div>
            <span>Creditos</span>
          </label>

          <input
            type={"radio"}
            id="Filtro-7"
            key-name={"Unidades"}
            name="selected-F"
            onChange={handleRadioOption}
            checked={"Unidades" === placeholder}
          ></input>
          <label className="label-radio label-7" htmlFor="Filtro-7">
            <div className="punto"></div>
            <span>Unidades</span>
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
          <option
            value={"0" + i + ":00 - " + (i + 1) + ":00"}
            key={Math.random() + i}
          ></option>
        )
      } else if (i < 10) {
        lista.push(
          <option
            value={"0" + i + ":00 - 0" + (i + 1) + ":00"}
            key={Math.random() + i}
          ></option>
        )
      } else {
        lista.push(
          <option
            value={i + ":00 - " + (i + 1) + ":00"}
            key={Math.random() + i}
          ></option>
        )
      }
    }
    for (let i = 7; i < 21; i++) {
      if (i === 9) {
        lista.push(
          <option
            value={"0" + i + ":00 - " + (i + 2) + ":00"}
            key={Math.random() + i}
          ></option>
        )
      } else if (i < 10) {
        lista.push(
          <option
            value={"0" + i + ":00 - 0" + (i + 2) + ":00"}
            key={Math.random() + i}
          ></option>
        )
      } else {
        lista.push(
          <option
            value={i + ":00 - " + (i + 2) + ":00"}
            key={Math.random() + i}
          ></option>
        )
      }
      i += 1
    }
    console.log(lista)
    return lista
  }
  return (
    <>
      {loading === false ? (
        <div className="containerMaterias">
          <h1>Materias</h1>
          <form>
            <div className="form group modal Materia">
              {placeholder === "Hora" ? (
                <>
                  {" "}
                  <input
                    type="text"
                    list="Hora-list"
                    id={placeholder}
                    name="Materia-name"
                    className="inputMaterias-search"
                    onChange={buscador}
                    value={filtroInput}
                    required
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
                    name="Materia-name"
                    className="inputMaterias-search"
                    onChange={buscador}
                    value={filtroInput}
                    required
                  />
                </>
              )}

              <span className="highlight Materias"></span>
              <span className="bottomBar Materias-main"></span>
              <label className="Materias-search">{placeholder}</label>
            </div>
          </form>
          <Filtros />
          <div className="tabla">
            {filtrados !== undefined && Object.keys(filtrados).length !== 0 ? (
              <table>
                <tbody>
                  {filtrados.map((materia) => {
                    return (
                      <tr key={materia.Clave_reticula}>
                        <td onClick={() => details(materia.Clave_reticula)}>
                          {materia.Nombre_Materia}
                        </td>
                      </tr>
                    )
                  })}
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
                    setPlaceholder("Nombre de Materia")
                    setFiltroInput("")
                    setFiltrados(materiaData)
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
                onClick={add}
              ></input>
            </>
          )}
          {/* Detalles */}
          <Modal
            show={showModalDetails}
            setShow={setShowModalDetails}
            title={modificaciones.Materia_name}
          >
            <form>
              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-name"
                  name="Materia_reticula"
                  className="inputMaterias"
                  value={addData.Materia_reticula}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Reticula de la Materia</label>
              </div>

              <div className="form group modal Materia">
                <select
                  name="Nombre_Carrera"
                  value={addData.Nombre_Carrera}
                  onChange={handleSelectOnChange}
                >
                  {Object.keys(carreraData).length !== 0 ? (
                    carreraData.map((carrera) => (
                      <option
                        key={carrera.ID_Carrera}
                        value={carrera.Nombre_Carrera}
                      >
                        {carrera.Nombre_Carrera}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Carrera de la Materia</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-name"
                  name="Materia_name"
                  className="inputMaterias"
                  value={addData.Materia_name}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Nombre de Materia</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-horas-teoricas"
                  name="Materia_horas_teoricas"
                  className="inputMaterias"
                  value={addData.Materia_horas_teoricas}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Horas Teoricas</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-horas-practicas"
                  name="Materia_horas_practicas"
                  className="inputMaterias"
                  value={addData.Materia_horas_practicas}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Horas Practicas</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-creditos"
                  name="Materia_creditos"
                  className="inputMaterias"
                  value={addData.Materia_creditos}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Creditos</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-unidades"
                  name="Materia_unidades"
                  className="inputMaterias"
                  value={addData.Materia_unidades}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Unidades</label>
              </div>
            </form>
            <div className="Materias-Detalles buttons">
              <input
                type="submit"
                className="button Materias"
                value="Modificar"
                onClick={() => setShowModalConfirm(true)}
              />
              <input
                type="submit"
                className="button Materias delete"
                value="Eliminar"
                onClick={() => setShowModalDelete(true)}
              />
            </div>
          </Modal>
          {/* Agregar */}
          <Modal
            show={showModalAdd}
            setShow={setShowModalAdd}
            title={"Agregar Materia"}
          >
            <form>
              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-name"
                  name="Materia_reticula"
                  className="inputMaterias"
                  value={addData.Materia_reticula}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Reticula de la Materia</label>
              </div>

              <div className="form group modal Materia">
                <select
                  name="Nombre_Carrera"
                  value={addData.Nombre_Carrera}
                  onChange={handleSelectOnChange}
                >
                  {Object.keys(carreraData).length !== 0 ? (
                    carreraData.map((carrera) => (
                      <option
                        key={carrera.ID_Carrera}
                        value={carrera.Nombre_Carrera}
                      >
                        {carrera.Nombre_Carrera}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </select>
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Carrera de la Materia</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-name"
                  name="Materia_name"
                  className="inputMaterias"
                  value={addData.Materia_name}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Nombre de Materia</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-horas-teoricas"
                  name="Materia_horas_teoricas"
                  className="inputMaterias"
                  value={addData.Materia_horas_teoricas}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Horas Teoricas</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-horas-practicas"
                  name="Materia_horas_practicas"
                  className="inputMaterias"
                  value={addData.Materia_horas_practicas}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Horas Practicas</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-creditos"
                  name="Materia_creditos"
                  className="inputMaterias"
                  value={addData.Materia_creditos}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Creditos</label>
              </div>

              <div className="form group modal Materia">
                <input
                  type="text"
                  id="Materia-unidades"
                  name="Materia_unidades"
                  className="inputMaterias"
                  value={addData.Materia_unidades}
                  onChange={handleSelectOnChange}
                  required
                />
                <span className="highlight Materias"></span>
                <span className="bottomBar Materias"></span>
                <label className="Materias">Unidades</label>
              </div>
            </form>

            <input
              type="submit"
              className="button Materias"
              value="Guardar"
              onClick={postermateria}
            />
          </Modal>
          {/* Eliminar */}
          <Modal
            show={showModalDelete}
            setShow={setShowModalDelete}
            title={modificaciones.Materia_name}
          >
            <p>
              Realmente esta seguro que quiere eliminar la Materia:{" "}
              <strong>{modificaciones.Materia_name}</strong>
            </p>
            <div className="Materias-Detalles buttons">
              <input
                type="submit"
                className="button Materias"
                value="Calcelar"
                onClick={() => setShowModalDelete(false)}
              />
              <input
                type="submit"
                className="button Materias delete"
                value="Confirmar"
                onClick={deleteMaterias}
              />
            </div>
          </Modal>
          {/* Confirmar */}
          <Modal
            show={showModalConfirm}
            setShow={setShowModalConfirm}
            title={modificaciones.Materia_name}
          >
            <div className="modal group">
              <p>
                Realmente esta seguro que quiere actualizar los datos de la
                Materia:
              </p>
              <br />
              <div className="Usuarios-Detalles summary">
                {modificaciones.Materia_reticula ===
                addData.Materia_reticula ? null : (
                  <p>
                    ID de la materia pasara de:{" "}
                    <strong className="Resaltado">
                      {modificaciones.Materia_reticula}
                    </strong>{" "}
                    a{" "}
                    <strong className="Resaltado">
                      {addData.Materia_reticula}
                    </strong>
                  </p>
                )}
                {modificaciones.Materia_name === addData.Materia_name ? null : (
                  <p>
                    Nombre de la materia pasara de:{" "}
                    <strong className="Resaltado">
                      {modificaciones.Materia_name}
                    </strong>{" "}
                    a{" "}
                    <strong className="Resaltado">
                      {addData.Materia_name}
                    </strong>
                  </p>
                )}
                {modificaciones.Materia_carrera ===
                addData.materia_carrera ? null : (
                  <p>
                    Carrera de la materia pasara de:{" "}
                    <strong className="Resaltado">
                      {modificaciones.Materia_nombre_carrera}
                    </strong>{" "}
                    a{" "}
                    <strong className="Resaltado">
                      {addData.Nombre_Carrera}
                    </strong>
                  </p>
                )}
                {modificaciones.Materia_horas_teoricas ===
                addData.Materia_horas_teoricas ? null : (
                  <p>
                    Las horas teoricas de la materia pasara de:{" "}
                    <strong className="Resaltado">
                      {modificaciones.Materia_horas_teoricas}
                    </strong>{" "}
                    a{" "}
                    <strong className="Resaltado">
                      {addData.Materia_horas_teoricas}
                    </strong>
                  </p>
                )}
                {modificaciones.Materia_horas_practicas ===
                addData.Materia_horas_practicas ? null : (
                  <p>
                    Las horas practicas de la materia pasara de:{" "}
                    <strong className="Resaltado">
                      {modificaciones.Materia_horas_practicas}
                    </strong>{" "}
                    a{" "}
                    <strong className="Resaltado">
                      {addData.Materia_horas_practicas}
                    </strong>
                  </p>
                )}
                {modificaciones.Materia_creditos ===
                addData.Materia_creditos ? null : (
                  <p>
                    Los creditos de la materia pasara de:{" "}
                    <strong className="Resaltado">
                      {modificaciones.Materia_creditos}
                    </strong>{" "}
                    a{" "}
                    <strong className="Resaltado">
                      {addData.Materia_creditos}
                    </strong>
                  </p>
                )}
                {modificaciones.Materia_unidades ===
                addData.Materia_unidades ? null : (
                  <p>
                    Las unidades de la materia pasara de:{" "}
                    <strong className="Resaltado">
                      {modificaciones.Materia_unidades}
                    </strong>{" "}
                    a{" "}
                    <strong className="Resaltado">
                      {addData.Materia_unidades}
                    </strong>
                  </p>
                )}
              </div>
            </div>
            <input
              type="submit"
              className="button Materias"
              value="Cancelar"
              onClick={() => setShowModalConfirm(false)}
            />
            <input
              type="submit"
              className="button Materias delete"
              value="Confirmar"
              onClick={confirmModificar}
            />
          </Modal>

          {/* Resultado de agregar */}
          <Modal
            show={showModalResultado}
            setShow={setShowModalResultado}
            title={resultadoTitulo}
          >
            <div className="modal group">
              <p>
                <strong>{statusContenido}</strong>
              </p>
            </div>
            <button
              type="submit"
              className="button Materias"
              onClick={closeAdd}
              value="OK"
            >
              OK
            </button>
          </Modal>
          {/* Modal no hay carreras */}
          {/* <Modal show={showModalNoCarreras} setShow={setShowModalNoCarreras} title={"No hay carreras"}>
                        <div className="modal group">
                            <p>No hay carreras registradas, por favor registre una carrera</p>
                        </div>
                        <button
                            type="submit"
                            className="button Materias"
                            onClick={() => setShowModalNoCarreras(false)}
                        >Cerrar</button>
                    </Modal> */}
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default Materias

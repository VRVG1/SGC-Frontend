//TODO: Agregar el ID para la borracion de materias
import React, { useState, useEffect, useContext } from "react";
import Modal from './modal/Modal.js'
import getAllCarrera from "./helpers/Carreras/getAllCarrera.js";
import getAllMaterias from "./helpers/Materias/getAllMaterias.js";
import deleteMateria from "./helpers/Materias/deleteMateria.js";
import Loader from "./Loader.js";
import postMateria from "./helpers/Materias/postMateria.js";
import putMateria from "./helpers/Materias/putMateria.js";

import kanaBuscar from "../img/kana-buscar.png";

import { AuthContext } from "./helpers/Auth/auth-context.js";
/**
 * Componente para la vista de materias
 * @param {*} props 
 * @returns componente
 */
const Materias = props => {
    let auth = useContext(AuthContext);

    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalDetails, setShowModalDetails] = useState(false);
    const [showModalResultado, setShowModalResultado] = useState(false);
    const [showModalModify, setShowModalModify] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    //const [showModalNoCarreras, setShowModalNoCarreras] = useState(false);
    const [materiaData, setMateriaData] = useState([]);
    const [filtrados, setFiltrados] = useState({})
    //const [carreraData, setCareraData] = useState({});
    const [addData, setAddData] = useState({
        Materia_name: '',
        //materia_carrera: '',
        Materia_semestre: '',
        Materia_grupo: '',
        Materia_ID: '',
        //Nombre_Carrera: ''
    });
    const [regex, setRegex] = useState({
        Materia_name: /^[A-Za-z\sÀ-ÿ]{0,200}$/,
        //materia_carrera: '',
        Materia_semestre: /^\d{0,2}$/,
        Materia_grupo: /^[A-Z]{0,1}$/,
        Materia_ID: /^[A-Z]{0,3}-{0,1}[0-9]{0,4}$/
    });
    //const [actualizarCarrera, setActualizarCarrera] = useState(0);
    const [actualizarMateria, setActualizarMateria] = useState(0);
    const [loading, setLoading] = useState(false);
    const [addMaterias, setAddMaterias] = useState('');
    const [statusContenido, setStatusContenido] = useState('');

    const [ID_Materia, setID_Materia] = useState('');
    const [Grado, setGrado] = useState("");
    const [Grupo, setGrupo] = useState('');
    const [Nombre_Materia, setNombre_Materia] = useState("");
    const [resultadoTitulo, setResultadoTitulo] = useState("");
    //const [ID_Carrera, setID_Carrera] = useState('');
    //const [Nombre_Carrera, setNombre_Carrera] = useState('')

    const [ptio, setPtio] = useState({})
    /**
     * Metodo para obtener todas las materiass
     */
    const obtenerMaterias = () => {
        getAllMaterias(auth.user.token).then((data) => {
            setMateriaData(data)
            setFiltrados(data)
        });
    }

    /**
     * Metodo para obtener todos los datos de la 
     * carrera desde la base de datos
     */
    // const obtenerCarrera = async () => {
    //     await getAllCarrera(auth.user.token).then((data) => {
    //         if (data.length > 0) {
    //             setCareraData(data)
    //         }
    //     });
    // }

    /**
     * useEffect para obtener los datos de carrera cada que se actualizen
     */
    // useEffect(() => {
    //     obtenerCarrera();
    // }, [actualizarCarrera])
    /**
     * hook useEffect para la recoleccion de datos generales de materias
     */
    useEffect(() => {
        obtenerMaterias();
    }, [actualizarMateria])

    /**
     * Metodo para realizar la accion borrar materia
     */
    const deleteMaterias = async () => {
        setLoading(true);
        setAddMaterias(await deleteMateria(ID_Materia, auth.user.token));
        setResultadoTitulo("Eliminación")
        setStatusContenido("Eliminación exitosa")
    }

    /**
     * Metodo para abrir la interfaz de modificar
     */
    const modifircar = () => {
        setAddMaterias("");
        setAddData({
            ...addData,
            Materia_name: Nombre_Materia,
            //materia_carrera: ID_Carrera,
            Materia_semestre: Grado,
            Materia_grupo: Grupo,
            Materia_ID: ID_Materia,
            //Nombre_Carrera: Nombre_Carrera
        });
        setShowModalConfirm(false);
        setShowModalModify(true);
        setShowModalDetails(false);
    };
    /**
     * Metodo para realizar la accion modificar
     */
    const confirmModificar = async () => {
        setLoading(true);
        setAddMaterias(await putMateria(addData, ID_Materia, auth.user.token));
        setStatusContenido("Se ha modificado la materia de manera exitosa");
        setResultadoTitulo("Modificación fue exitosa")
    };

    /**
     * Metodo para mostrar los detalles de una materia
     * @param {int} id  ID de la materia
     */
    function details(id) {
        const materia = materiaData.find(elemento => elemento.ID_Materia === id);
        //const carrera = carreraData.find(element => element.ID_Carrera === materia.Carrera);
        setGrado(materia.Grado);
        setGrupo(materia.Grupo);
        setID_Materia(materia.ID_Materia);
        setNombre_Materia(materia.Nombre_Materia);
        //setID_Carrera(carrera.ID_Carrera);
        //setNombre_Carrera(carrera.Nombre_Carrera);
        setAddMaterias('');
        setShowModalDetails(true);
        setAddData({
            ...addData,
            Materia_name: materia.Nombre_Materia,
            //materia_carrera: carrera.ID_Carrera,
            Materia_semestre: materia.Grado,
            Materia_grupo: materia.Grupo,
            Materia_ID: id,
            //Nombre_Carrera: carrera.Nombre_Carrera
        });
        setShowModalConfirm(false);
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
        //         Materia_ID: '',
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
            Materia_name: '',
            //materia_carrera: carreraData[0].ID_Carrera,
            Materia_semestre: '',
            Materia_grupo: '',
            Materia_ID: '',
            //Nombre_Carrera: carreraData[0].Nombre_Carrera
        });
        setAddMaterias('');
        //setActualizarCarrera(Math.random())
        setShowModalAdd(true);
    }
    /**
     * Metodo que tienen como parametro el eventeo del input usado para guardar el valor
     * en su respectiva variable usando useState()
     * @param {*} event 
     */
    const handleSelectOnChange = (event) => {
        //No tiene ni puto sentido que no se cambie el id pese a que claramente si se cambia ahi esta
        //Puto react
        if (event.target.value.match(regex[event.target.name]) != null) {
            if (event.target.name === "Nombre_Carrera") {
                setPtio({
                    ...ptio,
                    [event.target.name]: event.target.value,
                    //materia_carrera: carreraData.find(element => element.Nombre_Carrera === event.target.value).ID_Carrera
                })
                // setAddData({
                //     ...addData,
                //     materia_carrera: carreraData.find(element => element.Nombre_Carrera === event.target.value).ID_Carrera
                // });
            }
            setAddData({
                ...addData,
                [event.target.name]: event.target.value
            });
        }
    }
    useEffect(() => {
        setAddData({
            ...addData,
            materia_carrera: ptio.materia_carrera,
            Nombre_Carrera: ptio.Nombre_Carrera
        });
        return () => {
            setAddData({});
        }
    }, [ptio])

    /**
     * Metodo para crear un post de materia
     */
    const postermateria = async () => {
        setLoading(true);
        setAddMaterias(await postMateria(addData, auth.user.token));
        setStatusContenido("Se ha agregado la materia correctamente");
        setResultadoTitulo("Materia agregada")
    }

    /**
     * useEffect para mostrar mensaje de resultado al momento de agregar
     */
    useEffect(() => {
        if (addMaterias === "OK") {
            setShowModalResultado(true);
            setActualizarMateria(Math.random())
        } else if (addMaterias !== '') {
            setShowModalResultado(true);
            setStatusContenido("Problemas al realizar la operacion, intente mas tarde")
            setResultadoTitulo("ERROR")
            setActualizarMateria(Math.random())
        }
        setLoading(false)
    }, [addMaterias]);

    /**
 * Metodo para cerra todas los modales 
 */
    const closeAdd = () => {
        setAddMaterias('');
        setShowModalAdd(false);
        setShowModalResultado(false);
        setShowModalDelete(false);
        setShowModalConfirm(false);
        setShowModalDetails(false);
        setShowModalModify(false);
    }

    /**
 * Metodo para buscar en la tabla elementos
 * @param {*} event 
 */
    const buscador = (event) => {
        var filtrados = materiaData.map((materia) => {
            if (materia.Nombre_Materia.toLowerCase().includes(event.target.value.toLowerCase())) {
                return materia;
            }
        })
        filtrados = filtrados.filter((elemento) => {
            return elemento !== undefined
        })
        setFiltrados(filtrados)
    }
    return (
        <>
            {loading === false ? (
                <div className="containerMaterias">
                    <h1>Materias</h1>
                    <form>
                        <div className="form group modal Materia">
                            <input
                                type="text"
                                id="Materia-name"
                                name="Materia-name"
                                className="inputMaterias-search"
                                onChange={buscador}
                                required
                            />
                            <span className="highlight Materias"></span>
                            <span className="bottomBar Materias-main"></span>
                            <label className="Materias-search">Nombre de Materia</label>
                        </div>
                    </form>

                    <div className="tabla">
                        {Object.keys(filtrados).length !== 0 ? (
                            <table>
                                <tbody>
                                    {filtrados.map((materia) => {
                                        return (
                                            <tr key={materia.ID_Materia}>
                                                <td onClick={() => details(materia.ID_Materia)}>
                                                    {materia.Nombre_Materia}
                                                </td>
                                            </tr>
                                        );
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

                    <button
                        type="submit"
                        className="button Materias"
                        value="Agregar"
                        onClick={add}
                    >Agregar</button>
                    {/* Detalles */}
                    <Modal show={showModalDetails} setShow={setShowModalDetails} title={Nombre_Materia}>
                        <form>
                            <div className="form group modal Materia">
                                <input
                                    type="text"
                                    id="Materia-name"
                                    name="Materia_ID"
                                    className="inputMaterias"
                                    value={addData.Materia_ID}
                                    onChange={handleSelectOnChange}
                                    required
                                />
                                <span className="highlight Materias"></span>
                                <span className="bottomBar Materias"></span>
                                <label className="Materias">ID de Materia</label>
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

                            {/* <div className="form group modal Materia">
                                <select name="Nombre_Carrera" value={addData.Nombre_Carrera} onChange={handleSelectOnChange} >
                                    {Object.keys(carreraData).length !== 0 ? (carreraData.map((carrera) =>
                                        <option key={carrera.ID_Carrera} value={carrera.Nombre_Carrera}>{carrera.Nombre_Carrera}</option>
                                    )) : (<></>)}
                                </select>
                                <span className="highlight Materias"></span>
                                <span className="bottomBar Materias"></span>
                                <label className="Materias">Carrera de la Materia</label>
                            </div> */}
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
                    <Modal show={showModalAdd} setShow={setShowModalAdd} title={"Agregar Materia"}>
                        <form>
                            <div className="form group modal Materia">
                                <input
                                    type="text"
                                    id="Materia-name"
                                    name="Materia_ID"
                                    className="inputMaterias"
                                    value={addData.Materia_ID}
                                    onChange={handleSelectOnChange}
                                    required
                                />
                                <span className="highlight Materias"></span>
                                <span className="bottomBar Materias"></span>
                                <label className="Materias">ID de Materia</label>
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

                            {/* <div className="form group modal Materia">
                                <select name="Nombre_Carrera" value={addData.Nombre_Carrera} onChange={handleSelectOnChange} >
                                    {Object.keys(carreraData).length !== 0 ? (carreraData.map((carrera) =>
                                        <option key={carrera.ID_Carrera} value={carrera.Nombre_Carrera}>{carrera.Nombre_Carrera}</option>
                                    )) : (<></>)}
                                </select>
                                <span className="highlight Materias"></span>
                                <span className="bottomBar Materias"></span>
                                <label className="Materias">Carrera de la Materia</label>
                            </div> */}
                        </form>

                        <input
                            type="submit"
                            className="button Materias"
                            value="Guardar"
                            onClick={postermateria}
                        />
                    </Modal>
                    {/* Eliminar */}
                    <Modal show={showModalDelete} setShow={setShowModalDelete} title={Nombre_Materia}>
                        <p>Realmente esta seguro que quiere eliminar la Materia: <strong>{Nombre_Materia}</strong></p>
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
                    <Modal show={showModalConfirm} setShow={setShowModalConfirm} title={Nombre_Materia}>
                        <div className="modal group">
                            <p>Realmente esta seguro que quiere actualizar los datos de la Materia:</p>
                            <br />
                            <div className="Usuarios-Detalles summary">
                                {ID_Materia === addData.Materia_ID ? null : <p>ID de la materia pasara de: <strong className="Resaltado">{ID_Materia}</strong> a <strong className="Resaltado">{addData.Materia_ID}</strong></p>}
                                {Nombre_Materia === addData.Materia_name ? null : <p>Nombre de la materia pasara de: <strong className="Resaltado">{Nombre_Materia}</strong> a <strong className="Resaltado">{addData.Materia_name}</strong></p>}
                                {/* {ID_Carrera === addData.materia_carrera ? null : <p>Carrera de la materia pasara de: <strong className="Resaltado">{Nombre_Carrera}</strong> a <strong className="Resaltado">{addData.Nombre_Carrera}</strong></p>} */}
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
                    <Modal show={showModalResultado} setShow={setShowModalResultado} title={resultadoTitulo}>
                        <div className="modal group">
                            <p><strong>{statusContenido}</strong></p>
                        </div>
                        <button
                            type="submit"
                            className="button Materias"
                            onClick={closeAdd}
                            value="OK"
                        >OK</button>
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
    );
}

export default Materias;

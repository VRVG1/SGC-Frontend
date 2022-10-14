import React, { useState, useEffect, useContext } from "react";
import getAllUsuarios from "./helpers/Usuarios/getAllUsuarios.js";
import Modal from './modal/Modal.js'
import postAsigna from "./helpers/Reportes/postRepostes.js";
import getAllReportes from "./helpers/Reportes/getAllReportes.js";
import putReportes from "./helpers/Reportes/putReportes.js";
import deleteReportes from "./helpers/Reportes/deleteReporte.js";
import postSendReportes from "./helpers/Reportes/postSendReprote.js";
import sendReportes from "./helpers/Reportes/sendReprote.js";
import sendMail from "./helpers/Mensajeria/postMSM.js";
import { AuthContext } from "./helpers/Auth/auth-context.js";

const _ = require("lodash");



const ReportesAdmin = props => {

    let auth = useContext(AuthContext);
    const [actualizacion, setActualizacion] = useState(0);
    const [idReporte, setIdReporte] = useState(0);
    const [titulo, setTitulo] = useState("");
    const [mensaje, setMensaje] = useState('');
    const [showModalResultado, setShowModalResultado] = useState(false);
    const [contenidoModal, setContenidoModal] = useState('');
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalDetails, setShowModalDetails] = useState(false);
    const [selector, setSelector] = useState("Modal-Reportes-Admin-Select-hidden")
    const [dataInput, setdataInput] = useState({
        Repostes_name: '',
        Repostes_descripcion: '',
        Repostes_fecha: '',
        Repostes_obligatorio: true,
        opc: "General",
        nombreMasters: "",
        mensajeTXT: "",
    });
    const [showModalERROR, setShowModalERROR] = useState(false);
    const [modalContenido, setModalContenido] = useState({
        modalTitulo: "",
        modalMensaje: "",
    });
    const [tablaData, setTablaData] = useState([]);
    const [predictionData, setPredictionData] = useState([]);
    const [predictionData2, setPredictionData2] = useState([]);
    const [regex, setRegex] = useState({
        Repostes_name: /^[a-zA-Z\s\d~._-]{0,200}$/,
    });
    const [reprotes, setRepotes] = useState([]);



    /**
 * Recibe los datos escritos en un input
 * @param {*} event 
 */
    const handleInputOnChange = (event) => {
        if (event.target.value.match(regex[event.target.name]) != null) {
            setdataInput({
                ...dataInput,
                [event.target.name]: event.target.value
            });
        }
        if (event.target.name === "Repostes_obligatorio") {
            setdataInput({
                ...dataInput,
                [event.target.name]: event.target.checked
            });
        }
    }
    /**
     * Recibir los datos de los usuarion de la base de datos
     */
    useEffect(() => {
        const obtenerUsuarios = async () => {
            await getAllUsuarios(auth.user.token).then((data) => {
                //setPredictionData(data);
                data.map((item) => {
                    if (item.Tipo_Usuario === "Docente") {
                        setPredictionData2(predictionData2 => [...predictionData2, {
                            PK: item.PK,
                            Tipo_Usuario: item.Tipo_Usuario,
                            Nombre_Usuario: item.Nombre_Usuario,
                        }])
                    }
                }
                )
            });
        }
        const obtenerReportes = async () => {
            await getAllReportes(auth.user.token).then((data) => {
                setRepotes(data);
            })
        }
        obtenerReportes();
        obtenerUsuarios();
        return () => {
            setTablaData([]);
            setPredictionData([]);
            setRepotes([]);
        }
    }, [actualizacion]);

    /**
     * Recibe los datos escritos en un input
     * 
     */
    const agregarReporte = () => {
        setdataInput({
            ...dataInput,
            Repostes_name: "",
            Repostes_descripcion: '',
            Repostes_fecha: '',
            Repostes_obligatorio: true
        });
        setShowModalAdd(true)
    }
    /**
     * Buscar algo, el maestro a mandar el mensaje
     * @param {*} event 
     */
    const buscador = (event) => {
        const { value } = event.target;
        const filtro = _.filter(predictionData2, (item) => {
            return item.Nombre_Usuario.toLowerCase().includes(value.toLowerCase());
        }
        );
        if (value === "") {
            setPredictionData([]);
        } else {
            setPredictionData(filtro);
        }
    }

    /**
     * Manda el reporte a la base de datos para guardar, solo guardar
     */
    const guardarReporteAdd = async () => {
        if (reprotes.filter(item => item.Nombre_Reporte === dataInput.Repostes_name).length === 0) {
            if (dataInput.Repostes_name !== "" && dataInput.Repostes_descripcion !== "" && dataInput.Repostes_fecha !== "") {
                await postAsigna(dataInput, auth.user.token).then((data) => {
                    setMensaje("Reporte agregado correctamente");
                    setShowModalResultado(true);
                    setShowModalAdd(false);
                    setContenidoModal("Reporte agregado correctamente");
                    setdataInput({
                        ...dataInput,
                        Repostes_name: "",
                        Repostes_descripcion: '',
                        Repostes_fecha: '',
                        Repostes_obligatorio: true
                    });
                }
                ).catch((error) => {
                    setMensaje("Error al agregar el reporte");
                    setShowModalResultado(true);
                    setShowModalAdd(false);
                    setContenidoModal("Favor de revisar el manual de administrador");
                });
                setActualizacion(Math.random());
            } else {
                setContenidoModal("Todos los campos son obligatorios");
                setMensaje("");
                setShowModalResultado(true);
            }
        } else {
            setMensaje("Ya existe un reportes con el nombre:\n" + dataInput.Repostes_name);
            setShowModalResultado(true);
            setContenidoModal("El reporte ya existe");
        }
    }
    /**
     * Manda el reporte a la base de datos para guardar y enviar el reporte para los docentes
     */
    const guardarYEnviarAdd = async () => {
        if (reprotes.filter(item => item.Nombre_Reporte === dataInput.Repostes_name).length === 0) {
            if (dataInput.Repostes_name !== "" && dataInput.Repostes_descripcion !== "" && dataInput.Repostes_fecha !== "") {
                await postSendReportes(dataInput, auth.user.token).then((data) => {
                    setMensaje("Reporte agregado y enviado correctamente");
                    setShowModalResultado(true);
                    setShowModalAdd(false);
                    setContenidoModal("Reporte agregado correctamente");
                    setdataInput({
                        ...dataInput,
                        Repostes_name: "",
                        Repostes_descripcion: '',
                        Repostes_fecha: '',
                        Repostes_obligatorio: true
                    });
                }
                ).catch((error) => {
                    setMensaje("Error al agregar y enviar el reporte");
                    setShowModalResultado(true);
                    setShowModalAdd(false);
                    setContenidoModal("Favor de revisar el manual de administrador");
                }
                );
                setActualizacion(Math.random());

            } else {
                setContenidoModal("Todos los campos son obligatorios");
                setMensaje("");
                setShowModalResultado(true);
            }
        } else {
            setMensaje("Ya existe un reportes con el nombre:\n" + dataInput.Repostes_name);
            setShowModalResultado(true);
            setContenidoModal("El reporte ya existe");
        }

    }

    /**
     * Metodo para abrir el modal de detalles con los datos del reporte
     * @param {*} ID_Reporte 
     */
    const detalles = (ID_Reporte) => {
        setIdReporte(ID_Reporte)
        const reporte = reprotes.find(elemento => elemento.ID_Reporte === ID_Reporte);
        setTitulo(reporte.Nombre_Reporte);
        setdataInput({
            ...dataInput,
            Repostes_name: reporte.Nombre_Reporte,
            Repostes_descripcion: reporte.Descripcion,
            Repostes_fecha: reporte.Fecha_Entrega,
            Repostes_obligatorio: reporte.Opcional,
            opc: "General",
            nombreMasters: "",
        });
        setShowModalDetails(true);
    }
    /**
     * Metodo para realizar la peticion de actualizacion en la base de datos
     */
    const putReporte = async () => {
        await putReportes(auth.user.token, idReporte, dataInput).then((data) => {
            setMensaje("Reporte agregado correctamente");
            setShowModalResultado(true);
            setShowModalDetails(false);
            setContenidoModal("Reporte actualizado correctamente");
            setdataInput({
                ...dataInput,
                Repostes_name: "",
                Repostes_descripcion: '',
                Repostes_fecha: '',
                Repostes_obligatorio: true
            });
        }
        ).catch((error) => {
            setMensaje("Error al agregar el reporte");
            setShowModalResultado(true);
            setShowModalDetails(false);
            setContenidoModal("Favor de revisar el manual de administrador");
        }
        );
        setActualizacion(Math.random());
    }

    /**
     * Metodo para eliminar un reporte de la base de datos
     */
    const deleteReprote = async () => {
        await deleteReportes(auth.user.token, idReporte).then((data) => {
            setMensaje("Reporte eliminado correctamente");
            setShowModalResultado(true);
            setShowModalDetails(false);
            setContenidoModal("Operacion realizada correctamente");
        }
        ).catch((error) => {
            setMensaje("Error al eliminar el reporte");
            setShowModalResultado(true);
            setShowModalDetails(false);
            setContenidoModal("Favor de revisar el manual de administrador");
        });
        setActualizacion(Math.random());
        setShowModalERROR(false);
    }

    /**
     * Metodo para enviar un reprote guardado
     */
    const sendReporte = async () => {
        await sendReportes(auth.user.token, idReporte).then((data) => {
            setMensaje("Reporte enviado correctamente");
            setShowModalResultado(true);
            setShowModalDetails(false);
            setContenidoModal(data);
        }
        ).catch((error) => {
            setMensaje("Error al enviar el reporte");
            setShowModalResultado(true);
            setShowModalDetails(false);
            setContenidoModal(error);
        }
        );
        //setActualizacion(Math.random());
    }

    const mandarMensaje = async () => {
        if (dataInput.mensajeTXT !== "") {
            if (dataInput.opc === "General") {
                await sendMail(auth.user.token, dataInput.mensajeTXT, "0").then((data) => {
                    setMensaje(dataInput.mensajeTXT);
                    setShowModalResultado(true);
                    setShowModalDetails(false);
                    setContenidoModal(data);
                }
                ).catch((error) => {
                    setMensaje("Error al enviar el mensaje");
                    setShowModalResultado(true);
                    setShowModalDetails(false);
                    setContenidoModal(error);
                }
                );
            } else if (dataInput.opc === "Especifico") {
                let mensajeResultado = '';
                tablaData.map(element => {
                    sendMail(auth.user.token, dataInput.mensajeTXT, element.id).then((data) => {
                        mensajeResultado = mensajeResultado + data + '\n';
                    }
                    ).catch((error) => {
                        mensajeResultado = error;
                        setShowModalResultado(true);
                        setShowModalDetails(false);
                        setContenidoModal(error);
                    }
                    );
                })
                setMensaje(dataInput.mensajeTXT);
                setShowModalResultado(true);
                setShowModalDetails(false);
                setContenidoModal("Correos enviados correctamente");
            }
        } else {
            setContenidoModal("Agregue un mensaje");
            setMensaje("No se puede mandar un mensaje vacio");
            setShowModalResultado(true);
        }
    }

    return (
        <>
            <div className="containerReportes">
                <h1> Reportes Admin </h1>
                <div className="tabla">
                    <table>
                        <tbody>
                            {Object.keys(reprotes).length !== 0 ? (reprotes.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td onClick={() => detalles(item.ID_Reporte)}>{item.Nombre_Reporte}</td>
                                    </tr>
                                )
                            })) : (
                                <></>
                            )}
                        </tbody>
                    </table>
                </div>

                <button onClick={agregarReporte}>Agregar</button>
                <div className="Reportes-Admin-mensajes">
                    <label className="Label-ReportesAdmin">Mensaje de correo:</label>
                    <textarea
                        className="textareaModalReportesAdmin"
                        name="mensajeTXT"
                        value={dataInput.mensajeTXT}
                        onChange={handleInputOnChange}>

                    </textarea>
                    <form className="form-reportesAdmin-modal">
                        <div className="Reportes-Admin-mensajes-radios">
                            <label className="Label-ReportesAdmin">Destinatario:</label>
                            <p className="Modal-Reportes-Admin-p"><input
                                type="radio"
                                name="opc"
                                value={"Especifico"}
                                onChange={handleInputOnChange}
                                checked={dataInput.opc === "Especifico"}
                                onClick={() => setSelector("Modal-Reportes-Admin-Select")}></input>Especifico</p>
                            <p><input
                                type="radio"
                                name="opc"
                                value={"General"}
                                onChange={handleInputOnChange}
                                checked={dataInput.opc === "General"}
                                onClick={() => setSelector("Modal-Reportes-Admin-Select-hidden")}></input>General</p>
                        </div>
                    </form>
                    <div className={selector}>
                        <label className="Label-ReportesAdmin">Usuarios:</label>
                        <div className="seleccionMasters">
                            <div className="tabla">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tablaData.map((data, i) => (
                                            <tr key={data.id}>
                                                <td>{data.nombre}</td>
                                                <td>
                                                    <button
                                                        name="usuarios"
                                                        onClick={() => {
                                                            setTablaData(tablaData.filter(item => item.id !== data.id))
                                                            setPredictionData(predictionData => [...predictionData, {
                                                                PK: data.id,
                                                                Tipo_Usuario: "Docente",
                                                                Nombre_Usuario: data.nombre,
                                                            }])
                                                            setPredictionData2(predictionData2 => [...predictionData2, {
                                                                PK: data.id,
                                                                Tipo_Usuario: "Docente",
                                                                Nombre_Usuario: data.nombre,
                                                            }])
                                                        }}
                                                    >Quitar</button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                            <div className="Chanchuya1">
                                <div className="form group modal Materia">
                                    <input
                                        type="text"
                                        id="nombreMasters"
                                        name="nombreMasters"
                                        className="inputMaterias-search"
                                        onChange={buscador}
                                        //value={dataInput.nombreMasters}
                                        required
                                    />
                                    <ul className="prediction">
                                        {Object.keys(predictionData).length !== 0 ? predictionData.map((data, i) => (
                                            <li key={i}
                                                onClick={() => {
                                                    setTablaData(tablaData => [...tablaData, { id: data.PK, nombre: data.Nombre_Usuario }])
                                                    setdataInput({
                                                        ...dataInput,
                                                        Repostes_name: ""
                                                    })
                                                    setPredictionData(predictionData.filter(item => item.PK !== data.PK))
                                                    setPredictionData2(predictionData2.filter(item => item.PK !== data.PK))
                                                }}>{data.Nombre_Usuario}</li>
                                        )) : <></>}
                                    </ul>
                                    <span className="highlight Materias"></span>
                                    <span className="bottomBar Materias-main"></span>
                                    <label className="Materias-search">Nombre del Docente</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={mandarMensaje}>Enviar</button>
                </div>
            </div>


            <Modal show={showModalAdd} setShow={setShowModalAdd} title={"Agregar y Enviar Reporte"}>
                <div className="ModalReportes">
                    <form>
                        <div className="form group modal Materia">
                            <input
                                type="text"
                                id="Repostes_name"
                                name="Repostes_name"
                                className="inputMaterias-search"
                                onChange={handleInputOnChange}
                                value={dataInput.Repostes_name}
                                required
                            />
                            <span className="highlight Materias"></span>
                            <span className="bottomBar Materias-main"></span>
                            <label className="Materias-search">Nombre del reporte</label>
                        </div>
                    </form>
                    <label className="LabelModalReportesAdmin">Descripción: </label>
                    <textarea
                        name="Repostes_descripcion"
                        className="textareaModalReportesAdmin"
                        value={dataInput.Repostes_descripcion}
                        onChange={handleInputOnChange}>
                    </textarea>
                    <form className="form-reportesAdmin-modal">
                        <div className="Modal-Reportes-Admin-grid">
                            <div className="Modal-Reportes-Admin-grid-item1">
                                <label className="LabelModalReportesAdmin">Fecha de entrega: </label>
                                <input
                                    className="Modal-Reportes-Admin-Date"
                                    type="date"
                                    name="Repostes_fecha"
                                    value={dataInput.Repostes_fecha}
                                    onChange={handleInputOnChange}
                                ></input>
                            </div>
                            <div className="Modal-Reportes-Admin-grid-item2">
                                <label className="LabelModalReportesAdmin separado">Obligatorio</label>
                                <input
                                    type="checkbox"
                                    name="Repostes_obligatorio"
                                    onChange={handleInputOnChange}
                                    checked={dataInput.Repostes_obligatorio} />
                            </div>
                        </div>
                    </form>
                    <div className="sinIdeas">
                        <button onClick={guardarReporteAdd}>Guardar</button>
                        <button onClick={guardarYEnviarAdd}>Guardar y Enviar</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showModalDetails} setShow={setShowModalDetails} title={titulo}>
                {/* Crear un gird de 4 columnas y 3 filas */}
                <div className="ModalReportes-grid">
                    <div className="container-rep-admin">
                        <div className="inputs-rep-admin">
                            <form>
                                <div className="form group modal Materia">
                                    <input
                                        type="text"
                                        id="Repostes_name"
                                        name="Repostes_name"
                                        className="inputModalReportesAdmin"
                                        onChange={handleInputOnChange}
                                        value={dataInput.Repostes_name}
                                        required
                                    />
                                    <span className="highlightReportesAdmin"></span>
                                    <span className="bottomBarReportesAdmin"></span>
                                    <label className="ReportesAdmin">Nombre del reporte</label>
                                </div>
                            </form>
                        </div>
                        <div className="TextArea-rep-admin">
                            <label className="labelDescripcion">Descripción: </label>
                            <textarea
                                name="Repostes_descripcion"
                                className="textareaModalReportesAdmin"
                                value={dataInput.Repostes_descripcion}
                                onChange={handleInputOnChange}>
                            </textarea>
                        </div>
                        <div className="OtrosInputs-rep-admin">
                            <form>
                                <div className="modalL">
                                    <label className="LabelModalReportesAdmin">Fecha de entrega: </label>
                                    <input
                                        className="Modal-Reportes-Admin-Date"
                                        type="date"
                                        name="Repostes_fecha"
                                        value={dataInput.Repostes_fecha}
                                        onChange={handleInputOnChange}
                                    ></input>
                                </div>
                                <div className="modalR">
                                    <label className="LabelModalReportesAdmin separado">Obligatorio</label>
                                    <input
                                        type="checkbox"
                                        name="Repostes_obligatorio"
                                        onChange={handleInputOnChange}
                                        checked={dataInput.Repostes_obligatorio} />
                                </div>
                            </form>
                        </div>
                        <div className="botones-rep-admin">
                            <button className="Eliminar" onClick={() => {
                                setShowModalERROR(true);
                                setModalContenido({
                                    ...contenidoModal,
                                    modalTitulo: "Eliminar Reporte",
                                    modalMensaje: "¿Está seguro que desea eliminar el reporte?",
                                })
                            }} >Eliminar</button>
                            <button onClick={putReporte}>Guardar</button>
                            <button onClick={sendReporte}>Enviar</button>
                        </div>
                    </div>



                    <div className="Usuarios-Detalles buttons">
                    </div>
                </div>
            </Modal>

            <Modal show={showModalResultado} setShow={setShowModalResultado} title={contenidoModal}>
                <div className="modalReportes">
                    <p><strong>{mensaje}</strong></p>
                    <button
                        className="button ReportesAdmin-button"
                        onClick={() => setShowModalResultado(false)}
                    > OK</button>
                </div>
            </Modal>
            <Modal show={showModalERROR} setShow={setShowModalERROR} title={modalContenido.modalTitulo}>
                <div className="modalReportes">
                    <p><strong>{modalContenido.modalMensaje}</strong></p>
                    <div className="botones-rep-admin">
                        <button className="Eliminar" onClick={deleteReprote}>Borrar</button>
                        <button onClick={() => setShowModalERROR(false)} >Cancelar</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ReportesAdmin;
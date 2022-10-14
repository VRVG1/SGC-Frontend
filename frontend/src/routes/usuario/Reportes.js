import React, { useEffect, useRef, useState, useContext, useCallback } from 'react'
import getReportesU from '../helpers/usuarioReporte/getReportesU.js';
import getOneAsignan from '../helpers/Asignan/getOneAsignan.js';
import getOneRepirte from '../helpers/Reportes/getOneReporte.js';
import getAllCarrera from '../helpers/Carreras/getAllCarrera.js';
import getAllMaterias from '../helpers/Materias/getAllMaterias.js';
import getPDFName from '../helpers/Reportes/getPDFName.js';
import Modal from '../modal/Modal.js';
import deletePDF from '../helpers/usuarioReporte/deletePDF.js';
import { AuthContext } from "../helpers/Auth/auth-context.js";
import Loader from '../Loader.js';
import _ from 'lodash';
import postReportes from '../helpers/usuarioReporte/postReportes.js';
import putGeneran from '../helpers/usuarioReporte/putGeneran.js';

import kanaBuscar from "../../img/kana-buscar.png"

export const Reportes = () => {
    let auth = useContext(AuthContext);

    const reference = useRef(null);

    const [reportes, setReportes] = useState([]);// reportes son todos los reportes que se generaron
    const [selReporte, setSelReporte] = useState(null);// selReporte es el reporte seleccionado para la vista
    const [asignan, setAsignan] = useState([]);// asignan son todas las asignan que se generaron
    const [reporteName, setReporteName] = useState([]);// reporte que es uno individual para los titulos
    const [loading, setLoading] = useState(true);
    const [reportesFiltrados, setReportesFiltrados] = useState([]);// reportesFiltrados son los reportes filtrados
    const [iDBorrarPDF, setIDBorrarPDF] = useState(null);// idBorrarPDF es el id del reporte que se va a borrar
    const [materias, setMaterias] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [selMateria, setSelMateria] = useState({
        index: null,
        ID_Asignan: null,
        ID_Reporte: null,
        ID_Generacion: null,
    });

    const [mostarBotonAtras, setMostarBotonAtras] = useState(false);
    const [mostarBotonSiguiente, setMostarBotonSiguiente] = useState(true);
    const [archivosPDF, setArchivosPDF] = useState([]);
    const [showModalDatosEnviados, setShowModalDatosEnviados] = useState(false);
    const [pendejadaDeMierda, setPendejadaDeMierda] = useState(false);
    const [showModalBorrar, setShowModalBorrar] = useState(false);
    const [modalData, setModalData] = useState({
        mensaje: "",
        titulo: "",
    });


    const [files, setFiles] = useState('');
    const [filesTamano, setFilesTamano] = useState(true);
    const [fileProgeso, setFileProgeso] = useState(false);
    const [fileResponse, setFileResponse] = useState(null);

    const deletePDFS = async () => {
        await deletePDF(auth.user.token, selMateria.ID_Generacion);
        setShowModalBorrar(false);
        setModalData({
            mensaje: "Se han borrado los PDFs",
            titulo: "Borrado",
        });
        setShowModalDatosEnviados(true);
        window.location.reload();
    }

    /**
     * Metodo que sirve para appendiar los archivos a subir
     */
    const uploadFileHandler = (e) => {
        setFiles(e.target.files);

    }
    /**
     * Metodo que sirve como intermediario entre el helper y el metodo de abajo xd
     * @param {*} formData 
     */
    const uploadFile = async (formData) => {
        setFileProgeso(true);
        await postReportes(auth.user.token, formData)
            .then(res => {
                setFileResponse(res);
                setFileProgeso(false);
            })
    }

    const getPDF = async (id) => {
        await getPDFName(id, auth.user.token).then(res => {
            setArchivosPDF(res);
        }).catch(err => {
            console.log(err);
        })
    }

    /**
     * Funcion para subir los archivos a la base de datos
     * @param {*} e 
     */
    const fileSummit = async (e) => {
        if (Object.keys(archivosPDF).length > 0) {
            setModalData({
                mensaje: "Ya se a enviado este reporte",
                titulo: "Reporte entregado",
            });
            setShowModalDatosEnviados(true);
        } else if (files === '') {
            setModalData({
                mensaje: "No has seleccionado ningun archivo",
                titulo: "Error",
            });
            setShowModalDatosEnviados(true);
        } else {
            e.preventDefault();
            setLoading(true)
            const formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                formData.append("Path_PDF", files[i]);
                formData.append("ID_Generacion", selMateria.ID_Generacion);
                await uploadFile(formData);
            }
            await putGeneran(auth.user.token, selMateria.ID_Generacion);
            setLoading(false);
            window.location.reload();
        }
    }

    /**
     * Metodo para mostrar los archivos que se van a subir o si se puede, los que ya se subieron
     * @param {*} props 
     * @returns 
     */
    const FilesShow = () => {
        let mensaje = [];
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                mensaje = mensaje.concat(
                    <div className='archivo' key={i}>
                        <p className='archivoP' key={i}>{files[i].name}</p>
                    </div>
                );
            }
            return mensaje;
        }
        let si = 1;
        for (let key in archivosPDF) {
            mensaje = mensaje.concat(
                <div className='archivo' key={key}>
                    <p className='archivoP' onClick={() => {
                        setShowModalBorrar(true)
                        setIDBorrarPDF(key)
                    }} key={si + key}>{archivosPDF[key]}</p>
                </div>
            )
            si++;
        }
        return mensaje;
    }
    useEffect(() => {
        if (selMateria.ID_Asignan !== null) {
            setArchivosPDF(getPDF(selMateria.ID_Generacion));
        }
    }, [selMateria]);

    useEffect(() => {
        setLoading(false);
        setPendejadaDeMierda(true);
    }, [archivosPDF]);
    /**
     * useEffect para obtener las materias
     */

    useEffect(() => {
        const getMaterias = async () => {
            await getAllMaterias(auth.user.token).then(res => {
                setMaterias(res);
            });
        }
        const getCarreras = async () => {
            await getAllCarrera(auth.user.token).then(res => {
                setCarreras(res);
            });
        }
        getMaterias();
        getCarreras();
    }, []);
    /**
     *  Funcion para obtener todos los reportes que se le asgino al maestro
     */
    const getReporte = useCallback(
        async () => {
            await getReportesU(auth.user.token).then(res => {
                setReportes(res);
            });
        },
        [],
    )

    /**
     * Funcion para obtener los asginan del maestro
     */
    const getAsignan = useCallback(
        async (id) => {
            await getOneAsignan(auth.user.token, id).then(res => {
                setAsignan(arrays => [...arrays, res]);
            });
        },
        [],
    )

    /**
     * Funcion para obtener los reportes individuales
     */
    const getReporteName = useCallback(
        async (id) => {
            await getOneRepirte(auth.user.token, id).then(res => {
                setReporteName(arrays => [...arrays, res]);
            });
        },
        [],
    )
    /**
     * Funcnion para obtener los ids de los reportes
     */
    const setIds = reportes.map(reporte => reporte.ID_Reporte);

    const setIdsAsignan = reportes.map(reportes => reportes.ID_Asignan);

    /**
     * Useeffect para obtener los reportes
     */
    useEffect(() => {
        getReporte();
    }, [getReporte]);

    /**
     * Useeffect para almacenar los datos a precentar
     */
    useEffect(() => {
        if (reportes.length > 0) {
            let array = setIds;
            let arrayAsignan = setIdsAsignan;
            let arrayAsignan2 = [];
            let array2 = [];
            array2 = array.filter(function (item, pos) {
                return array.indexOf(item) === pos;
            })
            arrayAsignan2 = arrayAsignan.filter(function (item, pos) {
                return arrayAsignan.indexOf(item) === pos;
            })
            array2.map(async (id) => {
                await getReporteName(id);
            })
            arrayAsignan2.map(async (id) => {
                await getAsignan(id);
            });
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [reportes]);

    const cargarReportesFiltrados = useCallback(
        async (array, index) => {
            setMostarBotonAtras(false);
            setMostarBotonSiguiente(true);
            setReportesFiltrados(array)
            setSelMateria({
                ...selMateria,
                ID_Asignan: array[0].ID_Asignan,
                ID_Generacion: array[0].ID_Generacion,
                ID_Reporte: array[0].ID_Reporte,
                index: 0
            });
        }, [])

    /**
     * Filtra los reportes que coincidan con el reporte seleccionado
     * @param {*} index 
     */
    const filtrarReportes = async (index) => {
        setSelReporte(reporteName[index]);
        let array = reportes.filter(reporte => (reporte.ID_Reporte === reporteName[index].ID_Reporte));
        setLoading(true);
        await cargarReportesFiltrados(array, index);
        setLoading(false);
    }
    /**
     * Funcion para mostar el titulo en las cartas de reportes
     * @returns 
     */
    const TituloMateria = () => {
        let titulo;
        if (selMateria.ID_Asignan !== null) {
            let grado = asignan.filter(asigna => (asigna.ID_Asignan === selMateria.ID_Asignan))[0].Grado;
            let grupo = asignan.filter(asigna => (asigna.ID_Asignan === selMateria.ID_Asignan))[0].Grupo;
            let ID_Materia = asignan.filter(asigna => (asigna.ID_Asignan === selMateria.ID_Asignan))[0].ID_Materia;
            let ID_Carrera = asignan.filter(asigna => (asigna.ID_Asignan === selMateria.ID_Asignan))[0].ID_Carrera;
            let nombreMateria = materias.filter(materia => (materia.ID_Materia === ID_Materia))[0].Nombre_Materia;
            let NombreCarrera = carreras.filter(carrera => (carrera.ID_Carrera === ID_Carrera))[0].Nombre_Carrera;
            titulo = (
                <h3>
                    {NombreCarrera + "\t" + nombreMateria + "\t" + grado + "\t" + grupo}
                </h3>
            );
        }
        return titulo
    }

    /**
     * Metodo para ver el reporte siguiente
     */
    const siguiente = () => {
        if (selMateria.index < reportesFiltrados.length - 1) {
            setMostarBotonAtras(true);
            setFiles("");
            setSelMateria({
                ...selMateria,
                index: selMateria.index + 1,
                ID_Asignan: reportesFiltrados[selMateria.index + 1].ID_Asignan,
                ID_Reporte: reportesFiltrados[selMateria.index + 1].ID_Reporte,
                ID_Generacion: reportesFiltrados[selMateria.index + 1].ID_Generacion,
            });
            setArchivosPDF(getPDF(reportesFiltrados[selMateria.index + 1].ID_Generacion));
            if (selMateria.index === reportesFiltrados.length - 2) {
                setMostarBotonSiguiente(false);
                setMostarBotonAtras(true);
            }
        } else {
            setMostarBotonSiguiente(false);
            setMostarBotonAtras(true);

        }
    }

    /**
     * Funcion para ver el reporte anterior
     */
    const anterior = () => {
        if (selMateria.index > 0) {
            setMostarBotonSiguiente(true);
            setFiles("");
            setSelMateria({
                ...selMateria,
                index: selMateria.index - 1,
                ID_Asignan: reportesFiltrados[selMateria.index - 1].ID_Asignan,
                ID_Reporte: reportesFiltrados[selMateria.index - 1].ID_Reporte,
                ID_Generacion: reportesFiltrados[selMateria.index - 1].ID_Generacion,
            });
            setArchivosPDF(getPDF(reportesFiltrados[selMateria.index - 1].ID_Generacion));
            if (selMateria.index === 1) {
                setMostarBotonAtras(false);
                setMostarBotonSiguiente(true);
            }
        } else {
            setMostarBotonAtras(false);
            setMostarBotonSiguiente(true);
        }
    }

    const SetDots = () => {
        let date = new Date();
        let hoy = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let dots = [];
        let si = new Date(hoy).getTime()

        if (reporteName.filter(reporte => (reporte.ID_Reporte === selMateria.ID_Reporte))[0].Opcional) {
            for (let i = 0; i < reportesFiltrados.length; i++) {
                let diff = ((new Date(reporteName.filter(reporte => (reporte.ID_Reporte === reportesFiltrados[i].ID_Reporte))[0].Fecha_Entrega).getTime()) - si) / (1000 * 60 * 60 * 24)
                if (reportesFiltrados[i].Estatus === "Entrega tarde") {
                    dots.push(<span key={i} className="dot tarde"></span>);
                } else if (reportesFiltrados[i].Estatus === "Entrega a tiempo") {
                    dots.push(<span key={i} className="dot"></span>);
                } else if (diff < 0) {
                    dots.push(<span key={i} className="dot noEntregado"></span>);
                } else if (diff > 0 && diff < 6) {
                    dots.push(<span key={i} className="dot trucha"></span>);
                } else {
                    dots.push(<span key={i} className="dot actual"></span>);
                }
            }
        } else {
            for (let i = 0; i < reportesFiltrados.length; i++) {
                let diff = ((new Date(reporteName.filter(reporte => (reporte.ID_Reporte === reportesFiltrados[i].ID_Reporte))[0].Fecha_Entrega).getTime()) - si) / (1000 * 60 * 60 * 24)
                dots.push(<span key={i} className="square"></span>);
            }
        }
        return dots;
    }
    /**
     * Metodos para listar todos los archivos PDF que se van a borrar
     */
    const MostrarArchivos = () => {
        let lista = [];
        for (let key in archivosPDF) {
            lista.push(
                <p>{archivosPDF[key]}</p>
            )
        }
        return lista;
    }
    return (
        <>
            {loading === false ?
                (<>
                    {Object.keys(reportes).length !== 0 ? <>
                        <div className='reportesUser-Container'>
                            <div className='listReportes'>
                                <ul>
                                    {Object.keys(reporteName).length !== 0 ? reporteName.map((reporte, index) => {
                                        if (reporte.Opcional) {
                                            return (
                                                <li key={index}>
                                                    <div className='listReportes__Reporte'
                                                        onClick={() => {
                                                            filtrarReportes(index)
                                                        }}>
                                                        {reporte.Nombre_Reporte}
                                                    </div>
                                                </li>
                                            )
                                        } else {
                                            return (
                                                <li key={index}>
                                                    <div className='listReportes__Reporte__cuadrado'
                                                        onClick={() => { filtrarReportes(index) }}>
                                                        {reporte.Nombre_Reporte}
                                                    </div>
                                                </li>
                                            )
                                        }
                                    }) :
                                        <>
                                        </>}
                                </ul>
                            </div>
                            <div className='cabeceraReportes'>
                                {selReporte !== null ?
                                    <>
                                        <h1 className='reportesUsuario'>{selReporte.Nombre_Reporte}</h1>
                                        <hr />
                                        <p className='reportesUsuario'>{selReporte.Descripcion}</p>

                                    </> : <></>}
                            </div>
                            <div className='subirArchivos'>
                                {selMateria.index !== null ?
                                    <>
                                        <div className='subirArchivos__module'>
                                            <TituloMateria />
                                            <hr />
                                            <div className='fileUploadU-grid'>
                                                <div className='fileUpload'>
                                                    <div className="file-uploadU">
                                                        <p className='subidor__pU'>Soltar archivo(s)</p>
                                                        <div className='subidorU'>
                                                            <input
                                                                id={"index"}
                                                                accept=".pdf"
                                                                type="file"
                                                                onChange={uploadFileHandler}
                                                                className="file-uploadU__input"
                                                                multiple />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='listFile'>
                                                    <div className='fileNames-containerU'>
                                                        {pendejadaDeMierda ?
                                                            <>
                                                                <FilesShow />
                                                            </> : <></>}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={fileSummit}
                                            >Enviar</button>
                                        </div>
                                        <div className='buttons_selector'>
                                            {mostarBotonAtras ? <button className='BotonAtras' id="siguiente" onClick={anterior}>Anterior</button> : <button className='BotonAtras' id="siguiente" disabled>Anterior</button>}
                                            <div className='dots'>
                                                <SetDots />
                                            </div>
                                            {mostarBotonSiguiente ? <button className='BotonAdelante' id="anterior" onClick={siguiente}>Siguiente</button> : <button className='BotonAdelante' id="anterior" disabled>Siguiente</button>}
                                        </div>
                                    </> : <></>}
                            </div>
                        </div>
                        <Modal show={showModalDatosEnviados} setShow={setShowModalDatosEnviados} title={modalData.titulo}>
                            <p className='alertMSM'>{modalData.mensaje}</p>
                            {/* <button onClick={todoListo}>Confirmar</button> */}
                        </Modal>
                        <Modal show={showModalBorrar} setShow={setShowModalBorrar} title={"Eliminar Archivo"}>
                            <div className='modal-borrar'>
                                <p className='alertMSM'>Estas segurode de borrar toda la entrega:</p>
                                <MostrarArchivos />
                                {/* <p className='alertMSM'>{archivosPDF[iDBorrarPDF]}</p> */}
                                <button className='alertMSM' onClick={() => {
                                    console.log(selMateria.ID_Generacion);
                                    deletePDFS();
                                }}>Confirmar</button>
                            </div>
                        </Modal>
                    </> :
                        <>
                            

                            <div className='Sin_Resultados img'>
                                <img src={"/static/media/kana-buscar.7a7b8c78c2c4aaec2dd5.png"} alt="Sin resultados" />
                                <h3 className='pito'>No hay reportes por el momento hasta que se seleccionen materias y se asginen por el administrador</h3>

                            </div>
                        </>}
                </>) :
                (<>
                    <Loader />
                </>)}


        </>
    )
}

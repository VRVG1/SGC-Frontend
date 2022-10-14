import React, { useEffect, useState, useContext, useCallback } from "react";
import Modal from './modal/Modal.js'
import getAllReportes from './helpers/Reportes/getAllReportes.js'
import getAllUsuarios from "./helpers/Usuarios/getAllUsuarios.js";
import getAsignanAllUser from "./helpers/Asignan/getAsignanAllUser.js";
import getGeneran from "./helpers/Generan/getGeneran.js";
import getAllMaterias from "./helpers/Materias/getAllMaterias.js";
import getPDFNames from "./helpers/Reportes/getPDFName.js";
import { AuthContext } from './helpers/Auth/auth-context.js';


import kanaBuscar from "../img/kana-buscar.png"
import Loader from "./Loader.js";
const _ = require("lodash");

const ReportesCheck = props => {
    let auth = useContext(AuthContext);

    const [selector, setSelector] = useState("Modal-Reportes-Admin-Select-hidden")
    const [hidden, setHidden] = useState({
        hidden1: "form group reportes-check",
        hidden2: "form group reportes-check hidden",
        hidden3: "form group reportes-check hidden",
        hidden4: "form group reportes-check hidden",
        hidden5: "form group reportes-check hidden",
    });
    const [oculto, setOculto] = useState({
        hidden1: "",
        hidden2: " hidden",
        hidden3: " hidden",
        hidden4: " hidden",
        hidden5: " hidden",
    });

    const [loading, setLoading] = useState(true);//useState para el loader
    const [reportes, setReportes] = useState([]);
    const [maestros, setMaestros] = useState([]);
    const [asignan, setAsignan] = useState([]);
    const [generan, setGeneran] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [pdfNames, setPdfNames] = useState([]);
    const [reporteMaster, setReporteMaster] = useState({
        reporte: "",
        maestro: "",
    });

    const [showModalArchivos, setShowModalArchivos] = useState(false);

    const [reportesFiltro, setReportesFiltro] = useState([]);
    const [maestrosFiltro, setMaestrosFiltro] = useState([]);
    const [asignanFiltro, setAsignanFiltro] = useState([]);
    const [generanFiltro, setGeneranFiltro] = useState([]);

    const [predictionData, setPredictionData] = useState([]);

    const [dataInput, setDataInput] = useState({
        reporte: null,
        maestro: null,
        materia: null,
        grupo: null,
    });

    /**
     * Metodo para obtener los generan de un reporte
     */
    const getGenerann = useCallback(async () => {
        await getGeneran(auth.user.token).then(res => {
            setGeneran(res);
            console.log("AQUI LO DE VIC");
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }, []);
    /**
     * Metodo para obtener todos los asignan
     */
    const getAsignan = useCallback(async () => {
        await getAsignanAllUser(auth.user.token).then(res => {
            setAsignan(res);
        }).catch(err => {
            console.log(err);
        });
    }, []);
    /**
     * Metodo para obtener todos los usuarios
     */

    const getMaestros = useCallback(async () => {
        getAllUsuarios(auth.user.token).then(res => {
            setMaestros(res);
            setMaestrosFiltro(res);
        }).catch(err => {
            console.log(err);
        });
    },
        [],
    );
    /**
    * Metodo para obtener todos los reportes de la base de datos
    */
    const getReportes = useCallback(async () => {
        await getAllReportes(auth.user.token).then(res => {
            setReportes(res);
        }).catch(err => {
            console.log(err);
        }, []);
    });
    /**
     * Metodo para obtener todas las materias de la base de datos
     */
    const getMaterias = useCallback(async () => {
        await getAllMaterias(auth.user.token).then(res => {
            setMaterias(res);
        }).catch(err => {
            console.log(err);
        }, []);
    });
    /**
     * Metodo para obtener todos los nombres de los pdfs
     */
    const getPDFName = useCallback(async (PK) => {
        await getPDFNames(PK, auth.user.token).then(res => {
            setPdfNames(res);
        }
        ).catch(err => {
            console.log(err);
        }
            , []);

    }, []);

    /**
     * Hook para cargar todos los datos necesarios para la vista
     */
    useEffect(() => {
        getReportes();
        getMaestros();
        getAsignan();
        getGenerann();
        getMaterias();
        setLoading(false);
        return () => {
            setReportes([]);
            setMaestros([]);
            setAsignan([]);
            setMaestrosFiltro([]);
            setGeneran([]);
            setMaterias([]);
        }
    }, []);


    /**
     * Metodo para ocultar los inputs de busqueda
     * @param {*} e 
     */
    const changeEstado = (e) => {
        if (e.target.checked === true) {
            setHidden({
                ...hidden,
                [e.target.id]: "form group reportes-check",
            });
            setOculto({
                ...oculto,
                [e.target.id]: "",
            });
        } else {
            setHidden({
                ...hidden,
                [e.target.id]: "form group reportes-check hidden",
            });
            setOculto({
                ...oculto,
                [e.target.id]: " hidden",
            });
        }

        if (e.target.id === "hidden1") {
            setDataInput({
                ...dataInput,
                nombreMasters: "",
            });
            setMaestrosFiltro(maestros);
        } else if (e.target.id === "hidden4") {
            setDataInput({
                ...dataInput,
                nombreMateria: "",
            });
        }
    }

    const Archivos = () => {
        let content = [];

        for (let key in pdfNames) {
            content.push(
                <a className="links" href={`http://localhost:8000/media/Generados/` + pdfNames[key]} target="_blank"><div className='archivo'>
                    <p className='archivoP'>{pdfNames[key]}</p>
                </div></a>
            )
        }
        return content;
    }

    /**
 * Buscar algo, el maester y asi
 * @param {*} event 
 */
    const buscador = (event) => {
        const { value } = event.target;
        const { name } = event.target;
        setDataInput({
            ...dataInput,
            [name]: value,
        });
        if (name === "nombreMasters") {
            let filteredMaestros;
            if (value.length > 0) {
                filteredMaestros = maestros.filter(maestro => {
                    return maestro.Nombre_Usuario.toLowerCase().includes(value.toLowerCase());
                });
            } else {
                filteredMaestros = [];
            }
            if (filteredMaestros.length > 0) {
                setMaestrosFiltro(filteredMaestros);
            } else {
                setMaestrosFiltro(maestros);
            }
            setPredictionData(filteredMaestros);
        } else if (name === "nombreMateria") {
            let filteredMaterias;
            if (value.length > 0) {
                filteredMaterias = materias.filter(materia => {
                    return materia.Nombre_Materia.toLowerCase().includes(value.toLowerCase());
                });
            } else {
                filteredMaterias = [];
            }
            setPredictionData(filteredMaterias);
        }
    }
    const actualizarBuscador = (name, filtro) => {
        if (name === "nombreMasters") {
            let filteredMaestros;
            filteredMaestros = maestros.filter(maestro => {
                return maestro.Nombre_Usuario.toLowerCase().includes(filtro.toLowerCase());
            });
        }
    }

    return (
        <>
            {loading === false ? (
                <>
                    <div className="container-ReportesCheck">
                        <div className="ReportesCheck-search">
                            <h1> Reportes Check </h1>

                            <div className="search-button-dialog">
                                <div className="search-button-dialog__content">

                                    {/* <p><input type="checkbox" id="hidden2" name="rbtn-search" value="Carrera"
                                        onClick={changeEstado} />Carrera</p>

                                        <p><input type="checkbox" id="hidden3" name="rbtn-search" value="Grupo"
                                    onClick={changeEstado} />Grupo</p> */}
                                    <p><input type="checkbox" defaultChecked="true" id="hidden1" name="rbtn-search" value="Maestro"
                                        onClick={changeEstado}
                                    />Docente</p>

                                    <p><input type="checkbox" id="hidden4" name="rbtn-search" value="Materia"
                                        onClick={changeEstado} />Materia</p>
                                </div>
                            </div>
                            <form>
                                <div className={hidden.hidden1}>
                                    <input
                                        type="text"
                                        id="nombreMasters"
                                        name="nombreMasters"
                                        className={"input-report-check-search" + oculto.hidden1}
                                        onChange={buscador}
                                        value={dataInput.nombreMasters}
                                        required
                                    />
                                    {/* Coincidencias */}
                                    {/* <ul className="predictionCheck">
                                        {Object.keys(predictionData).length !== 0 ? predictionData.map((data, i) => (
                                            <li key={i}
                                                name="nombreMasters"
                                                onClick={() => {
                                                    setDataInput({
                                                        ...dataInput,
                                                        nombreMasters: data.Nombre_Usuario,
                                                    });
                                                    setPredictionData([]);
                                                    actualizarBuscador("nombreMasters", data.Nombre_Usuario);
                                                }}>{data.Nombre_Usuario}</li>
                                        )) : <></>}
                                    </ul> */}
                                    <span className={"highlight reportes-check" + oculto.hidden1}></span>
                                    <span className={"bottomBar reportes-check" + oculto.hidden1}></span>
                                    <label className={"reportes-check" + oculto.hidden1}>Nombre del Docente</label>
                                </div>
                                {/* Carrera */}
                                {/* <div className={hidden.hidden2}>
                                    <input
                                        type="text"
                                        id="nombreCarrera"
                                        name="nombreCarrera"
                                        className={"input-report-check-search" + oculto.hidden2}
                                        onChange={buscador}
                                        value={dataInput.nombreCarrera ?? ""}
                                        required
                                    />
                                    <ul className="predictionCheck">
                                        {Object.keys(predictionData).length !== 0 ? predictionData.map((data, i) => (
                                            <li key={i}
                                                onClick={() => {
                                                    setDataInput({
                                                        ...dataInput,
                                                        nombreCarrera: data.Nombre_Usuario,
                                                    });
                                                    setPredictionData([]);
                                                }}>{data.Nombre_Usuario}</li>
                                        )) : <></>}
                                    </ul>
                                    <span className={"highlight reportes-check" + oculto.hidden2}></span>
                                    <span className={"bottomBar reportes-check" + oculto.hidden2}></span>
                                    <label className={"reportes-check" + oculto.hidden2}>Nombre de la Carrera</label>
                                </div> */}
                                {/* <div className={hidden.hidden3}>
                                    <select className={"input-report-check-search" + oculto.hidden3}>
                                        <option value={""}></option>
                                        <option value={"A"}>A</option>
                                        <option value={"B"}>B</option>
                                        <option value={"C"}>C</option>
                                        <option value={"D"}>D</option>
                                        <option value={"E"}>E</option>
                                    </select>
                                    <span className={"highlight reportes-check" + oculto.hidden3}></span>
                                    <span className={"bottomBar reportes-check" + oculto.hidden3}></span>
                                    <label className={"reportes-check" + oculto.hidden3}>Grupo</label>
                                </div> */}
                                <div className={hidden.hidden4}>
                                    <input
                                        type="text"
                                        id="nombreMateria"
                                        name="nombreMateria"
                                        className={"input-report-check-search" + oculto.hidden4}
                                        onChange={buscador}
                                        value={dataInput.nombreMateria}
                                        required
                                    />
                                    {/* Coincidencias */}
                                    {/* <ul className="predictionCheck">
                                        {Object.keys(predictionData).length !== 0 ? predictionData.map((data, i) => (
                                            <li key={i}
                                                onClick={() => {
                                                    setDataInput({
                                                        ...dataInput,
                                                        nombreMateria: data.Nombre_Materia,
                                                    });
                                                    setPredictionData([]);
                                                }}>{data.Nombre_Materia}</li>
                                        )) : <></>}
                                    </ul> */}
                                    <span className={"highlight reportes-check" + oculto.hidden4}></span>
                                    <span className={"bottomBar reportes-check" + oculto.hidden4}></span>
                                    <label className={"reportes-check" + oculto.hidden4}>Nombre de la materia</label>
                                </div>

                            </form>

                        </div>

                        <div className="contenedorRerportes">
                            {Object.keys(reportes).length !== 0 && Object.keys(generan).length !== 0 && Object.keys(materias).length !== 0 ?
                                (<>
                                    {reportes.map((reporte, index) => {
                                        return (
                                            <div className="contenedorMasterReporte">
                                                <h2 className="Reportes-Check">{reporte.Nombre_Reporte}</h2>
                                                <div className="contenedorMaterReporteTable">
                                                    {maestrosFiltro.map((maestro, index2) => {
                                                        if (maestro.Tipo_Usuario === "Docente") {
                                                            return (
                                                                <div>
                                                                    <h3 className="Reportes-Check">{maestro.Nombre_Usuario}</h3>
                                                                    <table className="table-ReportesCheck">
                                                                        <thead>
                                                                            <tr key={index2}>
                                                                                <th>Materias</th>
                                                                                <th>Grupo</th>
                                                                                <th>Estado</th>
                                                                                <th>Archivos</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="tbody-ReportesCheck">
                                                                            {asignan.map((asignan2, index) => {
                                                                                let estadoTxt = "";
                                                                                let estado = generan?.filter(generan => generan.ID_Reporte === reporte.ID_Reporte).filter(generan => generan.ID_Asignan === asignan2.ID_Asignan)[0];
                                                                                let PK = generan?.filter(generan => generan.ID_Reporte === reporte.ID_Reporte).filter(generan => generan.ID_Asignan === asignan2.ID_Asignan)[0];
                                                                                if (estado?.Estatus === null || estado?.Estatus === undefined) {
                                                                                    estadoTxt = "No entregado";
                                                                                } else {
                                                                                    estadoTxt = estado.Estatus;
                                                                                }
                                                                                if(PK?.ID_Generacion === null || PK?.ID_Generacion === undefined) {
                                                                                    PK = -1;
                                                                                }else {
                                                                                    PK = PK.ID_Generacion
                                                                                }
                                                                                if (asignan2.ID_Usuario === maestro.PK) {
                                                                                    let si = materias.filter(materia => materia.ID_Materia === asignan2.ID_Materia)[0].Nombre_Materia;
                                                                                    console.log("------");
                                                                                    console.log(estado, PK);


                                                                                    if (typeof (dataInput.nombreMateria) === "undefined") {
                                                                                        return (
                                                                                            <tr key={index}>
                                                                                                <td>{si}</td>
                                                                                                <td>{asignan2.Grupo}</td>
                                                                                                <td>{estadoTxt}</td>
                                                                                                <td><button onClick={() => {
                                                                                                    setReporteMaster({
                                                                                                        ...reporteMaster,
                                                                                                        reporte: reporte.Nombre_Reporte,
                                                                                                        maestro: maestro.Nombre_Usuario,
                                                                                                    })
                                                                                                    setShowModalArchivos(true);
                                                                                                    getPDFName(PK);
                                                                                                }}>Archivos</button></td>
                                                                                            </tr>
                                                                                        )
                                                                                    } else {
                                                                                        if (si.toLowerCase().includes(dataInput.nombreMateria) || dataInput.nombreMateria === si) {
                                                                                            return (
                                                                                                <tr key={index}>

                                                                                                    <td>{si}</td>
                                                                                                    <td>{asignan2.Grupo}</td>
                                                                                                    <td>{estadoTxt}</td>
                                                                                                    <td><button onClick={() => {
                                                                                                        setReporteMaster({
                                                                                                            ...reporteMaster,
                                                                                                            reporte: reporte.Nombre_Reporte,
                                                                                                            maestro: maestro.Nombre_Usuario,
                                                                                                        })
                                                                                                        setShowModalArchivos(true);
                                                                                                        getPDFName(PK);
                                                                                                    }}>Archivos</button></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>)
                                :
                                (<>
                                    <div className="Sin_Resultados">
                                        <p className="p">No hay reportes creados</p>
                                    </div>
                                    <div className="Sin_Resultados img">
                                        <img src={kanaBuscar} className="kana" alt="Sin resultados" />
                                    </div>
                                </>)}

                        </div>
                    </div>

                    <Modal show={showModalArchivos} setShow={setShowModalArchivos} title={reporteMaster.reporte + " - " + reporteMaster.maestro}>
                        <div className="modalRecuperar">
                            {Object.keys(pdfNames).length !== 0 ?
                                <>
                                    <Archivos />
                                </> :
                                <>
                                    <div className="Sin_Resultados">
                                        <p className="p">No hay archivos</p>
                                    </div>
                                    <div className="Sin_Resultados img">
                                        <img src={kanaBuscar} className="kana" alt="Sin resultados" />
                                    </div>
                                </>}
                            {/* <button onClick={() => setShowModalArchivos(false)}>Cerrar</button> */}
                        </div>
                    </Modal>

                </>
            ) : (
                <>
                    <Loader />
                </>
            )}
        </>
    )
}

export default ReportesCheck;
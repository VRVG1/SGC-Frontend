import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./helpers/Auth/auth-context";
import Menu from "../componentes/Menu";
import getAllCarrera from "./helpers/Carreras/getAllCarrera";
import filtroVerificacionGC from "./helpers/Reportes/filtroVerificacionGC";
import InterfazRegistros, { Button } from "../componentes/InterfazRegistros";

const defaultFormEmptyFields = {
    "lista-profesores": false,
    "lista-asignaturas": false,
    "lista-grado-grupo": false,
    "lista-temas": false,
}

function TableCell({customClassName="", children}) {
    return (
        <td className={customClassName}>
            <div className={"reporte__tabla__info"}>
                {children}
            </div>
        </td>
    );
}

function TableRow({rowInfo}) {
    return (
        <tr>
            {rowInfo.map(tdInfo => {
                return (
                    <TableCell
                        key={tdInfo.id}
                        customClassName={tdInfo.class}
                    >
                        {tdInfo.children}
                    </TableCell>
                );
            })}
        </tr>
    );
}

function TableRowList({rows}) {
    return rows.map((row, idx) => {
        return <TableRow key={`tr_${idx}`} rowInfo={row} />
    })
}

function TableHeader({classForTh, colSpanTh=1, rowSpanTh=1, children}) {
    return(
        <th
            className={classForTh}
            colSpan={colSpanTh}
            rowSpan={rowSpanTh}>{children}</th>
    ); 
}

function TableHeaderList({rowInfo}) {
    return (
        <tr>
            {rowInfo.map(thInfo => {
                return(
                    <TableHeader
                        key={thInfo.id}
                        classForTh={thInfo.class}
                        colSpanTh={thInfo.colSpan}
                        rowSpanTh={thInfo.rowSpan}
                    >{thInfo.children}</TableHeader>
                );
            })}
        </tr>
    );
}

function TableReporte({headersInfo, children}) {
    return (
        <table>
            <thead>
                {headersInfo.map(rowInfo => <TableHeaderList key={rowInfo.id} rowInfo={rowInfo.info} />)}
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    );
}

export default function ReportesVerificacionGestionCurso() {
    let auth = useContext(AuthContext);

    const [registroGeneral, setRegistroGeneral] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalEliminar, setShowModalEliminar] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formEmptyFields, setFormEmptyFields] = useState(defaultFormEmptyFields);
    const [isGradoGrupoBadFormat, setIsGradoGrupoBadFormat] = useState(false);
    const [gradoGrupoNotifyMsg, setGradoGrupoNotifyMsg] = useState("");
    const [isNeededUpdate, setIsNeededUpdate] = useState(false);

    const [academias, setAcademias] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [temas, setTemas] = useState([]);

    const [academia, setAcademia] = useState({});
    const [profesor, setProfesor] = useState({});
    const [asignatura, setAsignatura] = useState({});

    const [lastNoReporte, setLastNoReporte] = useState(1);
    const [numeroReporte, setNumeroReporte] = useState("");
    const [gradoGrupo, setGradoGrupo] = useState("");
    const [indReprobacion, setIndReprobacion] = useState("");
    const [semanaProgramada, setSemanaProgramada] = useState("");
    const [tema, setTema] = useState({});
    const [isVerificado, setIsVerificado] = useState(true);
    // Registró
    // Calificaciones en
    // Mindbox y
    // Realiza la
    // Retroalimentación
    // Correspondiente
    const [isRCMRRC, setIsRCMRRC] = useState(true);
    // Cumple con los
    // Criterios de
    // Evaluación
    // Establecidos en la
    // Instrumentación
    // Didactica
    const [isCCEEID, setIsCCEEID] = useState(true);
    const [observaciones, setObservaciones] = useState("");

    const obtenerAcademias = useCallback(() => {
        getAllCarrera(auth.user.token).then(data => {
            console.log("Academias:");
            console.log(data);
            setAcademias(data);
        });
    }, [setAcademias]);

    const obtenerProfesores = () => {
        if (academia instanceof Object && Object.keys(academia).length !== 0) {
            let nombreAcademia = academia["Nombre_Carrera"];
            filtroVerificacionGC(
                auth.user.token,
                nombreAcademia,
                "getProfesores"
            ).then(res => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            }).then(rcvData => {
                if (rcvData !== null) {
                    console.log("Profesores:");
                    console.log(rcvData);
                    setProfesores(rcvData);
                }
            }).catch(error => console.log(error));
        }
    }

    const obtenerRegistro = () => {
        if (academia instanceof Object && Object.keys(academia).length !== 0) {
            const idCarrera = academia["ID_Carrera"];
            filtroVerificacionGC(
                auth.user.token,
                idCarrera,
                "getRegistro"
            ).then(res => {
                return res.json();
            }).then(rcvData => {
                console.log("Registro General:");
                console.log(rcvData);
                if (rcvData["Error"] === undefined) {
                    const newLastReporteID = rcvData["lastReporteID"];
                    setLastNoReporte(newLastReporteID);
                    setNumeroReporte(newLastReporteID);
                    setRegistroGeneral(rcvData["registro"]);
                }
            }).catch(error => console.log(error));
        }
    }

    const obtenerAsignaturasProfesor = () => {
        if (profesor instanceof Object & Object.keys(profesor).length !== 0) {
            let nombreProfesor = profesor["Nombre_Usuario"];
            filtroVerificacionGC(
                auth.user.token,
                nombreProfesor,
                "getAsignaturas"
            ).then(res => {
                return res.json();
            }).then(rcvData => {
                console.log("Asignaturas:");
                console.log(rcvData);
                if (rcvData["Error"] === undefined) {
                    setAsignaturas(rcvData);
                }
            }).catch(error => console.log(error));
        }
    }

    useEffect(obtenerAcademias, [setAcademias]);
    useEffect(obtenerRegistro, [isNeededUpdate, academia, setLastNoReporte, setNumeroReporte, setRegistroGeneral]);
    useEffect(obtenerProfesores, [academia, setProfesores]);
    useEffect(obtenerAsignaturasProfesor, [profesor, setAsignaturas]);

    const obtenerTemas = (grado, grupo) => {
        const data = {
            "ID_Carrera": academia["ID_Carrera"],
            "Nombre_Maestro": profesor["Nombre_Usuario"],
            "ID_Materia": asignatura["pik"],
            "Grado": grado,
            "Grupo": grupo
        };
        console.log(`Grado: "${grado}" Grupo "${grupo}"`);
        filtroVerificacionGC(
            auth.user.token,
            data,
            "getTemas"
        ).then(res => {
            if (res.ok) {
                console.log("Encontrados temas relacionados con el profesor");
            }
            return res.json();
        }).then(rcvData => {
            if (rcvData["Error"] !== undefined) {
                console.log("Error");
                console.log(rcvData["Error"]);
            } else {
                setTemas(rcvData);
            }
        })
    }

    function updateEstadosReporte({
        profesor = {},
        asignatura = {},
        numeroReporte = lastNoReporte,
        gradoGrupo = "",
        indReprobacion = "",
        semanaProgramada = "",
        tema = {},
        isVerificado = true,
        isRCMRRC = true,
        isCCEEID = true,
        observaciones = ""
    } = {}) {
        setProfesor(profesor);
        setAsignatura(asignatura);
        setNumeroReporte(numeroReporte);
        setGradoGrupo(gradoGrupo);
        setIndReprobacion(indReprobacion);
        setSemanaProgramada(semanaProgramada);
        setTema(tema);
        setIsVerificado(isVerificado);
        setIsRCMRRC(isRCMRRC);
        setIsCCEEID(isCCEEID);
        setObservaciones(observaciones);
    }

    function addReporte(newReporte) {
        const data = {
            "academia": academia["ID_Carrera"],
            "dato": newReporte
        };
        filtroVerificacionGC(auth.user.token, data, "agregar").then(res => {
            if (res.ok) {
                updateEstadosReporte();
            }
            return res.json();
        }).then(rcvData => {
            if (rcvData["Error"] !== undefined) {
                console.log("Error");
                console.log(rcvData['Error']);
            } else {
                setIsNeededUpdate(!isNeededUpdate);
            }
        }).catch(error => console.log(error));
    }

    function updateReporte(modifiedReporte) {
        const data = {
            "academia": academia["ID_Carrera"],
            "dato": modifiedReporte
        }
        filtroVerificacionGC(auth.user.token, data, "modificar").then(res => {
            if (res.ok) {
                // TODO: Desactivar el modalAgregarModificar junto con la flag
                //       isUpdating
                setFlagsModal(false);
            }
            return res.json();
        }).then(rcvData => {
            if (rcvData["Error"] !== undefined) {
                console.log("Error");
                console.log(rcvData['Error']);
            } else {
                setIsNeededUpdate(!isNeededUpdate);
            }
        }).catch(error => console.log(error));
    }

    function deleteReporte() {
        const data = {
            "academia": academia["ID_Carrera"],
            "dato": numeroReporte
        }
        filtroVerificacionGC(auth.user.token, data, "eliminar").then(res => {
            if (res.ok) {
                updateEstadosReporte();
                setFlagModalEliminar(false);
            }
            return res.json();
        }).then(rcvData => {
            if (rcvData["Error"] !== undefined) {
                console.log("Error");
                console.log(rcvData['Error']);
            } else {
                setIsNeededUpdate(!isNeededUpdate);
            }
        }).catch(error => console.log(error));
    }

    function downloadExcel() {
        // TODO: Descargar Excel
        if (academia instanceof Object && Object.keys(academia).length !== 0) {
            const idCarrera = academia["ID_Carrera"]
            console.log("Download Excel");
            filtroVerificacionGC(auth.user.token, idCarrera, "descargar").then(res => {
                console.log("DownloadExcel");
                console.log(res);
                console.log(res.headers.get('content-disposition'));

                if (res.ok) {
                    console.log("Debería estar descargando...");
                }
                return res.blob();
            }).then(blob => {
                console.log(blob);
                const filename = "Formato para la Verificación de la Gestión del Curso.xlsx";
                let a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.setAttribute("download", filename);
                a.click();
            });
        }
    }


    function setAddingModal(change) {
        setShowModal(change);
        setIsAdding(change);
    }

    function setUpdatingModal(change) {
        setShowModal(change);
        setIsUpdating(change);
    }

    function setFlagsModal(change) {
        if (isAdding) {
            setAddingModal(change);
        }
        if (isUpdating) {
            setUpdatingModal(change);
        }
        if (!change) {
            // Si change es false quiere decir que el usuario esta cerrando el
            // componente <Modal/> (ya sea por el boton de cancelar o por
            // terminar de hacer una modificación), no importa el motivo, se
            // tiene que dejar todos los campos del estado de registro vacios
            // y las flags de los campos en su estado default.
            updateEstadosReporte();
            setIsGradoGrupoBadFormat(false);
            setFormEmptyFields(defaultFormEmptyFields);
        }
    }

    function setFlagModalEliminar(change) {
        setShowModalEliminar(change);
        if (!change) {
            // TODO: Llamar a todas las funciones que sean necesarias para
            //       limpiar las acciones realizadas dentro de modalEliminar
            updateEstadosReporte();
        }
    }

    function handleBtnAgregar() {
        console.log("handleBtnAgregar");
        setAddingModal(true);
    }

    const getRelatedData = async (reporte) => {
        const gradoGrupoAux = reporte.GradoGrupo;
        const rgGradoGrupo = /(?:^(?<carrera_code>[A-Z]{1})(?<grado>[0-9]{1})(?<grupo>[A-Z]{1})$)/;
        const resMatch = gradoGrupoAux.match(rgGradoGrupo);
        if (resMatch === null) {
            return undefined;
        }
        const grado = resMatch.groups.grado;
        const grupo = resMatch.groups.grupo;

        const rcvDataAsignatura = await filtroVerificacionGC(
            auth.user.token,
            reporte.nombreProfesor,
            "getAsignaturas"
        ).then(res => res.json());

        const asignaturaAux = rcvDataAsignatura.find(asignaturaObj => {
            return asignaturaObj["Nombre_Materia"] === reporte.asignatura;
        });
        const idMateria = await asignaturaAux.pik;
        const dato = {
            "ID_Carrera": academia["ID_Carrera"],
            "Nombre_Maestro": reporte.nombreProfesor,
            "ID_Materia": idMateria,
            "Grado": grado,
            "Grupo": grupo
        };
        const rcvDataTemas = await filtroVerificacionGC(
            auth.user.token,
            dato,
            "getTemas"
        ).then(res => res.json());

        const temaAux = rcvDataTemas.find(temaObj => {
            return temaObj["Nombre_Reporte"] === reporte.tema;
        });

        return [asignaturaAux, rcvDataTemas, temaAux];
    }

    function handleBtnModificar(reporte) {
        console.log("handleBtnModificar");
        console.log(reporte);
        const profesorAux = profesores.find(profesorObj => {
            return profesorObj["Nombre_Usuario"] === reporte.nombreProfesor;
        });
        getRelatedData(reporte).then(response => {
            const [asignaturaAux, rcvDataTemas, temaAux] = response;
            console.log("AsignaturaAux:");
            console.log(asignaturaAux);
            console.log("TemaAux:");
            console.log(temaAux);

            setTemas(rcvDataTemas);
            updateEstadosReporte({
                profesor: profesorAux,
                asignatura: asignaturaAux,
                numeroReporte: reporte.numeroReporte,
                gradoGrupo: reporte.GradoGrupo,
                indReprobacion: reporte.indReprobacion,
                semanaProgramada: reporte.semanaProgramada,
                tema: temaAux,
                isVerificado: reporte.verificacion,
                isRCMRRC: reporte.RCMRRC,
                isCCEEID: reporte.CCEEID,
                observaciones: reporte.observaciones
            });
            setUpdatingModal(true);
        });
        console.log(reporte);
    }

    function handleBtnEliminar(reporte) {
        // TODO: Activar el modalEliminar y hacer todo lo necesario para que
        //       suceda la eliminación del reporte
        console.log("handleBtnEliminar");
        setNumeroReporte(reporte["numeroReporte"]);
        setFlagModalEliminar(true);
    }

    function handleBtnGuardarModal() {
        console.log("handleBtnGuardarModal");
        let hasEmptyFields = false;
        const nextFormEmptyFields = {...formEmptyFields};
        if (Object.keys(profesor).length === 0) {
            nextFormEmptyFields["lista-profesores"] = true;
            hasEmptyFields = true;
        }
        if (Object.keys(asignatura).length === 0) {
            nextFormEmptyFields["lista-asignaturas"] = true;
            hasEmptyFields = true;
        }
        if (gradoGrupo === "") {
            nextFormEmptyFields["lista-grado-grupo"] = true;                
            setGradoGrupoNotifyMsg("Debe proporcionar un grado y grupo antes de guardar");
            hasEmptyFields = true;
        }
        if (Object.keys(tema).length === 0) {
            nextFormEmptyFields["lista-temas"] = true
            hasEmptyFields = true;
        }

        // Si hay campos vacios no procede con el guardado
        if (hasEmptyFields) {
            setFormEmptyFields(nextFormEmptyFields);
            return;
        }

        // Si todos los campos necesarios contienen información se procede
        // a evaluar
        // const data2Send = {
        //     "lastReporteID": lastNoReporte,
        //     "newReporte": {}
        // };
        const nextRegistro = {
            "numeroReporte": numeroReporte,
            "nombreProfesor": profesor.Nombre_Usuario,
            "asignatura": asignatura.Nombre_Materia,
            "GradoGrupo": gradoGrupo,
            "tema": tema["Nombre_Reporte"],
            "semanaProgramada": semanaProgramada,
            "verificacion": isVerificado,
            "RCMRRC": isRCMRRC,
            "indReprobacion": indReprobacion,
            "CCEEID": isCCEEID,
            "observaciones": observaciones
        };
        // data2Send["newReporte"] = (nextRegistro);
        if (isAdding) {
            addReporte(nextRegistro);
        } else if (isUpdating) {
            updateReporte(nextRegistro);
        }
    }

    function handleBtnEliminarModal() {
        console.log("handleBtnEliminarModal");
        // TODO: Eliminar el reporte seleccionado en el servidor
        deleteReporte();
    }

    function handleBtnCancelarModal() {
        console.log("handleBtnCancelarModal");
        // TODO: Limpiar la información de los estados y desactivar las
        //       banderas relacionadas al modalEliminar
        setFlagModalEliminar(false);
    }

    function handleMenuAcademia(event) {
        let value = event.target.value;
        if (value !== "") {
            let idCarrera = value;
            const academiaAux = academias.find(academiaObj => {
                return academiaObj['ID_Carrera'] === idCarrera;
            });
            setAcademia(academiaAux);
        }
    }

    function cleanProfesorField() {
        setAsignatura({});
        cleanAsignaturaField();
    }

    function cleanAsignaturaField() {
        setGradoGrupo("");
        cleanGradoGrupoField();
    }

    function cleanGradoGrupoField() {
        setTemas([]);
        cleanTemaField();
    }

    function cleanTemaField() {
        setTema({});
        setSemanaProgramada("");
        setIndReprobacion("");
    }

    const BloqueRegistros = () => {
        let contenido = (
            <div className="data__body__reportes_display">
                <h3>Todavía no hay ningún Cotejo registrado.</h3>
            </div>
        );

        if (registroGeneral.length !== 0) {
            const TABLE_ROWS = getTableRows();
            contenido =(
                <div className="reporte__tabla">
                    <TableReporte headersInfo={TABLE_HEADERS}>
                        <TableRowList rows={TABLE_ROWS}/>
                    </TableReporte>
                </div>
            ); 
        }
        return (
            <div className="data__body__reportes">
                {contenido} 
            </div>
        );
    }

    const getTableRows = () => {
        return registroGeneral.map((reporte, idx) => {
            return [{
                    "id": `numeroReporte_${idx}`,
                    "class": "vgc reporte__tabla__col_small",
                    "children": reporte["numeroReporte"]
                },
                {
                    "id": `nombreProfesor_${idx}`,
                    "class": "vgc reporte__tabla__col_relevant",
                    "children": reporte["nombreProfesor"]
                },
                {
                    "id": `asignatura_${idx}`,
                    "class": "vgc reporte__tabla__col_medium",
                    "children": reporte["asignatura"]
                },
                {
                    "id": `GradoGrupo_${idx}`,
                    "class": "vgc reporte__tabla__col_small",
                    "children": reporte["GradoGrupo"]
                },
                {
                    "id": `tema_${idx}`,
                    "class": "vgc reporte__tabla__col_tema",
                    "children": reporte["tema"]
                },
                {
                    "id": `semanaProgramada_${idx}`,
                    "class": "vgc reporte__tabla__col_medium",
                    "children": reporte["semanaProgramada"]
                },
                {
                    "id": `verificacion_${idx}`,
                    "class": "vgc reporte__tabla__col_small",
                    "children": reporte["verificacion"] ? "SI" : "NO"
                },
                {
                    "id": `RCMRRC_${idx}`,
                    "class": "vgc reporte__tabla__col_small",
                    "children": reporte["RCMRRC"] ? "SI" : "NO"
                },
                {
                    "id": `indReprobacion_${idx}`,
                    "class": "vgc reporte__tabla__col_small",
                    "children": reporte["indReprobacion"]
                },
                {
                    "id": `CCEEID_${idx}`,
                    "class": "vgc reporte__tabla__col_small",
                    "children": reporte["CCEEID"] ? "SI" : "NO"
                },
                {
                    "id": `observaciones_${idx}`,
                    "class": "vgc reporte__tabla__col_relevant",
                    "children": reporte["observaciones"]
                },
                {
                    "id": `btnModificar_${idx}`,
                    "class": "reporte__tabla__info_td_hover",
                    "children": (
                        <Button
                            className={""}
                            handler={() => {
                                handleBtnModificar(reporte);
                            }}
                            disabled={false}
                        >
                            Modificar
                        </Button>
                    )
                },
                {
                    "id": `btnEliminar_${idx}`,
                    "class": "reporte__tabla__info_td_hover",
                    "children": (
                        <Button
                            className={"button__eliminar"}
                            handler={() => {
                                handleBtnEliminar(reporte);
                            }}
                            disabled={false}
                        >
                            Eliminar
                        </Button>
                    )
                },
            ];
        });
    }

    const TABLE_HEADERS = [
        {   // Fila
            id: "tr_header_1",
            info: [     // Columnas
                {
                    id: "th_titulo",
                    "class": "",
                    "colSpan": 11,
                    "rowSpan": 1,
                    "children": "VERIFICACIÓN DE GESTIÓN DEL CURSO"
                }
            ]
        },
        {   // Fila
            id: "tr_header_2",
            info: [     // Columnas
                {
                    id: "th_1",
                    "class": "vgc reporte__tabla__col_small",
                    "colSpan": 1,
                    "rowSpan": 1,
                    "children": "No."
                },
                {
                    id: "th_2",
                    "class": "vgc reporte__tabla__col_relevant",
                    "colSpan": 1,
                    "rowSpan": 1,
                    "children": "Docente"
                },
                {
                    id: "th_3",
                    "class": "vgc reporte__tabla__col_medium",
                    "colSpan": 1,
                    "rowSpan": 1,
                    "children": "Asignatura"
                },
                {
                    id: "th_4",
                    "class": "vgc reporte__tabla__col_small",
                    "colSpan": 1,
                    "rowSpan": 1,
                    "children": "Grado y Grupo"
                },
                {
                    id: "th_5",
                    "class": "vgc reporte__tabla__col_tema",
                    "colSpan": 1,
                    "rowSpan": 1,
                    "children": "Tema"
                },
                {
                    id: "th_6",
                    "class": "vgc reporte__tabla__col_medium",
                    "colSpan": 1,
                    "rowSpan": 1,
                    "children": "Semana programada"
                },
                {
                    id: "th_7",
                    "class": "vgc reporte__tabla__col_small",
                    "colSpan": 1,
                    "rowSpan": 1,
                    "children": "Verificación"
                },
                {
                    id: "th_8",
                    "class": "vgc reporte__tabla__col_small",
                    "colSpan": 1,
                    "rowSpan": 1,
                    // TODO: Agregar el tooltip (no va a ser texto, va a ser un
                    //       <div>)
                    "children": "RCMRRC"
                },
                {
                    id: "th_9",
                    "class": "vgc reporte__tabla__col_small",
                    "colSpan": 1,
                    "rowSpan": 1,
                    "children": "% de Reprobación"
                },
                {
                    id: "th_10",
                    "class": "vgc reporte__tabla__col_small",
                    "colSpan": 1,
                    "rowSpan": 1,
                    // TODO: Agregar el tooltip (no va a ser texto, va a ser un
                    //       <div>)
                    "children": "CCEEID"
                },
                {
                    id: "th_11",
                    "class": "vgc reporte__tabla__col_relevant",
                    "colSpan": 1,
                    "rowSpan": 1,
                    "children": "Observaciones"
                },
            ]
        },
    ];

    const flagErrorWarnMsg = !formEmptyFields["lista-grado-grupo"] && !isGradoGrupoBadFormat;
    const formulario = (
        <form>
            <div className="vgc form__short_inputs">
                <label>
                    <span>
                        No.
                    </span>
                    <input
                        type={"number"}
                        name={"input-vgc-num"}
                        value={numeroReporte}
                        disabled={true}
                    />
                </label>
                <label>
                    <span>
                        % de reprobación:
                    </span>
                    <input
                        type={"number"}
                        name={"input-vgc-ind-reprobacion"}
                        value={indReprobacion}
                        disabled={true}
                    />
                </label>
                <label>
                    <span>
                        Semana Programada:
                    </span>
                    <input
                        type={"date"}
                        name={"input-vgc-semana-programada"}
                        value={semanaProgramada}
                        onChange={e => {
                            let value = e.target.value;
                            console.log(`Semana Programada: ${value}`);
                            setSemanaProgramada(e.target.value)
                        }}
                        onKeyDown={e => e.preventDefault()}
                        min={"2000-01-01"}
                        disabled={true}
                    />
                </label>
            </div>
            <div className={`form__menu_reportes ${formEmptyFields["lista-profesores"] ? "form__field_error" : ""}`}>
                <Menu
                    labelTxt="*Profesor:"
                    selectId="menu-profesores"
                    selectName="lista-profesores"
                    selectFn={(event) => {
                        let value = event.target.value;
                        if (value !== "") {
                            if (formEmptyFields["lista-profesores"]) {
                                setFormEmptyFields({
                                    ...formEmptyFields,
                                    "lista-profesores": false
                                });
                            }
                            let idProfesor = parseInt(value);
                            const profesorAux = profesores.find(profesorObj => {
                                return profesorObj["PK"] === idProfesor;
                            });
                            setProfesor(profesorAux);
                        } else {
                            setProfesor({});
                            setAsignaturas([]);
                        }
                        cleanProfesorField();
                    }}
                    selectValue={Object.keys(profesor).length === 0 ? "" : profesor['PK']}
                    defaultOptionTxt="--Elija un profesor--"
                    optionsList={profesores}
                    optKey="PK"
                    optValue="PK"
                    optTxt="Nombre_Usuario"
                    hidden={false}
                />
                <div className={"form__error_message"} hidden={!formEmptyFields["lista-profesores"]}>
                    <h5 hidden={!formEmptyFields["lista-profesores"]}>
                        Debe seleccionar un profesor antes de guardar
                    </h5>
                </div>
            </div>
            <div className={`form__menu_reportes ${formEmptyFields["lista-asignaturas"] ? "form__field_error" : ""}`}>
                <Menu
                    labelTxt="*Asignatura:"
                    selectId="menu-asignaturas"
                    selectName="lista-asignaturas"
                    selectFn={(event) => {
                        let value = event.target.value;
                        if (value !== "") {
                            if (formEmptyFields["lista-asignaturas"]) {
                                setFormEmptyFields({
                                    ...formEmptyFields,
                                    "lista-asignaturas": false
                                });
                            }
                            let claveReticula = value;
                            const asignaturaAux = asignaturas.find(asignaturaObj => {
                                return asignaturaObj["Clave_reticula"] === claveReticula;
                            });
                            setAsignatura(asignaturaAux);
                        } else {
                            setAsignatura({});
                        }
                        cleanAsignaturaField();
                    }}
                    selectValue={Object.keys(asignatura).length === 0 ? "" : asignatura["Clave_reticula"]}
                    defaultOptionTxt="--Elija una asignatura--"
                    optionsList={asignaturas}
                    optKey="Clave_reticula"
                    optValue="Clave_reticula"
                    optTxt="Nombre_Materia"
                    hidden={false}
                    disabled={Object.keys(profesor).length === 0}
                />
                <div className={"form__error_message"} hidden={!formEmptyFields["lista-profesores"]}>
                    <h5 hidden={!formEmptyFields["lista-profesores"]}>
                        Debe seleccionar una asignatura antes de guardar
                    </h5>
                </div>
            </div>
            <div className="vgc form__short_inputs">
                <label className={`${formEmptyFields["lista-grado-grupo"] ?
                        "form__field_error" : ""} ${isGradoGrupoBadFormat ?
                        "form__field_warn" : ""}`}
                >
                    <span>
                        Grado y Grupo:
                    </span>
                    <input
                        type={"text"}
                        name={"input-vgc-grado-grupo"}
                        value={gradoGrupo}
                        onChange={event => {
                            let newGradoGrupo = event.target.value;
                            if (formEmptyFields["lista-grado-grupo"]) {
                                setFormEmptyFields({
                                    ...formEmptyFields,
                                    "lista-grado-grupo": false
                                });
                            }
                            if (newGradoGrupo !== "") {
                                newGradoGrupo = newGradoGrupo.toUpperCase();
                                let rg = newGradoGrupo.length == 1 ?
                                    /(?:^[A-Z]{1}$)/ : newGradoGrupo.length <= 2 ?
                                    /(?:^[A-Z]{1}[0-9]{1}$)/ :
                                    /(?:^(?<carrera_code>[A-Z]{1})(?<grado>[0-9]{1})(?<grupo>[A-Z]{1})$)/;

                                const resMatch = newGradoGrupo.match(rg);
                                if (resMatch !== null) {
                                    if (newGradoGrupo.length > 2) {
                                        obtenerTemas(resMatch.groups.grado,
                                                     resMatch.groups.grupo);
                                    } else {
                                        cleanGradoGrupoField();
                                    }
                                    setIsGradoGrupoBadFormat(false);
                                } else {
                                    newGradoGrupo = gradoGrupo;
                                    setIsGradoGrupoBadFormat(true);
                                    setGradoGrupoNotifyMsg("El formato de Grado y Grupo debe ser: La letra de la carrera, el numero de semestre y la letra del grupo");
                                }
                            }
                            setGradoGrupo(newGradoGrupo);
                        }}
                        maxLength={3}
                        disabled={Object.keys(asignatura).length === 0}
                    />
                    <div className={`${formEmptyFields["lista-grado-grupo"] ?
                        "form__error_message" : ""} ${isGradoGrupoBadFormat ?
                        "form__warn_message" : ""}`}
                        hidden={flagErrorWarnMsg}
                    >
                        <h5 hidden={flagErrorWarnMsg}>
                            {gradoGrupoNotifyMsg}
                        </h5>
                    </div>
                </label>
                <div className={`form__menu_reportes ${formEmptyFields["lista-temas"] ? "form__field_error" : ""}`}>
                    <Menu
                        labelTxt="*Tema:"
                        selectId="menu-temas"
                        selectName="lista-temas"
                        selectFn={(event) => {
                            let value = event.target.value;
                            if (value !== "") {
                                if (formEmptyFields["lista-temas"]) {
                                    setFormEmptyFields({
                                        ...formEmptyFields,
                                        "lista-temas": false
                                    });
                                }
                                let idTema = parseInt(value);
                                const temaAux = temas.find(temaObj => {
                                    return temaObj["ID_Reporte"] === idTema;
                                });
                                setTema(temaAux);
                                setSemanaProgramada(temaAux["Fecha_Especificada_Entrega"]);
                                setIndReprobacion(temaAux["Reprobados"]);
                            } else {
                                cleanTemaField();
                            }
                        }}
                        selectValue={Object.keys(tema).length === 0 ? "" : tema['ID_Reporte']}
                        defaultOptionTxt="--Elija un tema--"
                        optionsList={temas}
                        optKey={'ID_Reporte'}
                        optValue={'ID_Reporte'}
                        optTxt={"Nombre_Reporte"}
                        hidden={false}
                        disabled={temas.length === 0}
                    />
                    <div className={"form__error_message"} hidden={!formEmptyFields["lista-temas"]}>
                        <h5 hidden={!formEmptyFields["lista-profesores"]}>
                            Debe seleccionar un tema antes de guardar
                        </h5>
                    </div>
                </div>
            </div>
            <div className="vgc form__large_input">
            </div>
            <div className="vgc form__short_inputs">
                <fieldset>
                    <legend>
                        Verificación:
                    </legend>
                    <div>
                        <label htmlFor={"verificacion-rSi"}>
                            Si
                        </label>
                        <input
                            type={"radio"}
                            id={"verificacion-rSi"}
                            name={"verify-radio-si"}
                            value={"Si"}
                            checked={isVerificado}
                            onChange={() => {
                                setIsVerificado(true);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor={"verificacion-rNo"}>
                            No
                        </label>
                        <input
                            type={"radio"}
                            id={"verificacion-rNo"}
                            name={"verify-radio-no"}
                            value={"No"}
                            checked={!isVerificado}
                            onChange={() => {
                                setIsVerificado(false);
                            }}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend className="vgc tooltip">
                        <div className="vgc tooltiptext">
                            <span>
                                <strong>R</strong>egistró&nbsp;
                                <strong>C</strong>alificaciones en&nbsp;
                                <strong>M</strong>indbox y&nbsp;
                                <strong>R</strong>ealiza la&nbsp;
                                <strong>R</strong>etroalimentación&nbsp;
                                <strong>C</strong>orrespondiente
                            </span>
                        </div>
                        RCMRRC:
                    </legend>
                    <div>
                        <label htmlFor={"RCMRRC-rSi"}>
                            Si
                        </label>
                        <input
                            type={"radio"}
                            id={"RCMRRC-rSi"}
                            name={"RCMRRC-radio-si"}
                            value={"Si"}
                            checked={isRCMRRC}
                            onChange={() => {
                                setIsRCMRRC(true);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor={"RCMRRC-rNo"}>
                            No
                        </label>
                        <input
                            type={"radio"}
                            id={"RCMRRC-rNo"}
                            name={"RCMRRC-radio-no"}
                            value={"No"}
                            checked={!isRCMRRC}
                            onChange={() => {
                                setIsRCMRRC(false);
                            }}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend className="vgc tooltip">
                        <div className="vgc tooltiptext">
                            <span>
                                <strong>C</strong>umple con los&nbsp;
                                <strong>C</strong>riterios de&nbsp;
                                <strong>E</strong>valuación&nbsp;
                                <strong>E</strong>stablecidos en la&nbsp;
                                <strong>I</strong>nstrumentación&nbsp;
                                <strong>D</strong>idactica
                            </span>
                        </div>
                        CCEEID:
                    </legend>
                    <div>
                        <label htmlFor={"CCEEID-rSi"}>
                            Si
                        </label>
                        <input
                            type={"radio"}
                            id={"CCEEID-rSi"}
                            name={"CCEEID-radio-si"}
                            value={"Si"}
                            checked={isCCEEID}
                            onChange={() => {
                                setIsCCEEID(true);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor={"CCEEID-rNo"}>
                            No
                        </label>
                        <input
                            type={"radio"}
                            id={"CCEEID-rNo"}
                            name={"CCEEID-radio-no"}
                            value={"No"}
                            checked={!isCCEEID}
                            onChange={() => {
                                setIsCCEEID(false);
                            }}
                        />
                    </div>
                </fieldset>
            </div>
            <div className="form__large_inputs">
                <div className="form__large_inputs__textarea">
                    <label>
                        <span>
                            Observaciones:
                        </span>
                        <textarea
                            name={"input-pnc-observaciones"}
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                        />
                    </label>
                </div>
            </div>
        </form>
    );

    const guiTitle = "Verificación de Gestión del Curso";
    const bloqueRegistros = <BloqueRegistros />
    const buttonsDataBody = [
        {
            "type": "button",
            "id": "btnAgregar",
            "handler": handleBtnAgregar,
            "btnTxt": "Agregar",
            "disabled": Object.keys(profesores).length === 0
        },
        {
            "type": "select",
            "id": "selectAcademia",
            "labelTxt": "",
            "selectId": "menu-academia",
            "selectName": "lista-carreras",
            "selectFn": handleMenuAcademia,
            "selectValue": Object.keys(academia).length === 0 ? "" : academia['ID_Carrera'],
            "defaultOptionTxt": "--Elija una Academia--",
            "optionsList": academias,
            "optKey": "ID_Carrera",
            "optValue": "ID_Carrera",
            "optTxt": "Nombre_Carrera"
        },
        {
            "type": "button",
            "id": "btnDescargar",
            "handler": downloadExcel,
            "btnTxt": "Descargar",
            // Por defecto el registro General contiene
            // "reportesRegistrados" por lo que un registro general
            // vacío contendría unicamente 1 key
            "disabled": registroGeneral.length === 0
        }
    ];
    const modalAgregarModificar = {
        "show": showModal,
        "setShow": setFlagsModal,
        "title": "Agregar Cotejo"
    };
    const buttonsModalAgregarModificar = [
        {
            "type": "button",
            "id": "btnModalGuardar",
            "handler": handleBtnGuardarModal,
            "btnTxt": "Guardar"
        }
    ];
    const modalEliminar = {
        "show": showModalEliminar,
        "setShow": setFlagModalEliminar,
        "title": "¿Desea eliminar el Cotejo?"
    };
    const buttonsModalEliminar = [
        {
            "type": "button",
            "id": "btnModalEliminar",
            "className": "button__eliminar",
            "handler": handleBtnEliminarModal,
            "btnTxt": "Eliminar"
        },
        {
            "type": "button",
            "id": "btnModalCancelar",
            "handler": handleBtnCancelarModal,
            "btnTxt": "Cancelar"
        }
    ];

    return (
        <InterfazRegistros
            guiTitle={guiTitle}
            bloqueRegistros={bloqueRegistros}
            buttonsDataBody={buttonsDataBody}
            modalAgregarModificar={modalAgregarModificar}
            classForModalContent={"vgc"}
            classForModalContentButtons={"vgc"}
            buttonsModalAgregarModificar={buttonsModalAgregarModificar}
            formulario={formulario}
            modalEliminar={modalEliminar}
            buttonsModalEliminar={buttonsModalEliminar}
        />
    )
}

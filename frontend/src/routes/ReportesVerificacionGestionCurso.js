import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./helpers/Auth/auth-context";
import Menu from "../componentes/Menu";
import InterfazRegistros from "../componentes/InterfazRegistros";
import getAllCarrera from "./helpers/Carreras/getAllCarrera";
import filtroVerificacionGC from "./helpers/Reportes/filtroVerificacionGC";

const defaultFormEmptyFields = {
    "lista-profesores": false,
    "lista-asignaturas": false,
    "lista-grado-grupo": false,
    "input-tema": false,
}

export default function ReportesVerificacionGestionCurso() {
    let auth = useContext(AuthContext);

    const [registroGeneral, setRegistroGeneral] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showModalEliminar, setShowModalEliminar] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formEmptyFields, setFormEmptyFields] = useState(defaultFormEmptyFields);
    const [isGradoGrupoBadFormat, setIsGradoGrupoBadFormat] = useState(false);
    const [gradoGrupoNotifyMsg, setGradpoGrupoNotifyMsg] = useState("");

    const [academias, setAcademias] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);

    const [academia, setAcademia] = useState({});
    const [profesor, setProfesor] = useState({});
    const [asignatura, setAsignatura] = useState({});

    const [lastReporteID, setLastReporteID] = useState(1);
    const [reporteID, setReporteID] = useState("");
    const [gradoGrupo, setGradoGrupo] = useState("");
    const [indReprobacion, setIndReprobacion] = useState("");
    const [semanaProgramada, setSemanaProgramada] = useState("");
    const [tema, setTema] = useState("");
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
            let idCarrera = academia["ID_Carrera"];
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
                    setLastReporteID(newLastReporteID);
                    setReporteID(newLastReporteID);
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
    useEffect(obtenerRegistro, [academia, setLastReporteID, setReporteID, setRegistroGeneral]);
    useEffect(obtenerProfesores, [academia, setProfesores]);
    useEffect(obtenerAsignaturasProfesor, [profesor, setAsignaturas]);

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
            // TODO: Llamar a todas las funciones que sean necesarias para
            //       limpiar las acciones realizadas dentro de
            //       modalAgregarModificar
        }
    }

    function setFlagModalEliminar(change) {
        setShowModalEliminar(change);
        if (!change) {
            // TODO: Llamar a todas las funciones que sean necesarias para
            //       limpiar las acciones realizadas dentro de modalEliminar
        }
    }

    function handleBtnAgregar() {
        console.log("handleBtnAgregar");
        setAddingModal(true);
    }

    function downloadExcel() {
        console.log("Download Excel");
    }

    function handleBtnGuardarModal() {
        console.log("handleBtnGuardarModal");
    }

    function handleBtnEliminarModal() {
        console.log("handleBtnEliminarModal");
    }

    function handleBtnCancelarModal() {
        console.log("handleBtnCancelarModal");
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

    const BloqueRegistros = () => {
        let contenido = (
            <div className="data__body__reportes_display">
                <h3>Todavía no hay ningún Cotejo registrado.</h3>
            </div>
        );
        return contenido;
    }

    const flagErrorWarnMsg = !formEmptyFields["lista-grado-grupo"] && !isGradoGrupoBadFormat;
    const formulario = (
        <form>
            <div className="form__short_inputs">
                <label>
                    <span>
                        No.
                    </span>
                    <input
                        type={"number"}
                        name={"input-vgc-num"}
                        value={reporteID}
                        disabled={true}
                    />
                </label>
                <label>
                    <span>
                        % de reprobación
                    </span>
                    <input
                        type={"number"}
                        name={"input-vgc-ind-reprobacion"}
                        value={indReprobacion}
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
                            setAsignatura({});
                            setReporteID("");
                        }
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
                    }}
                    selectValue={Object.keys(asignatura).length === 0 ? "" : asignatura["Clave_reticula"]}
                    defaultOptionTxt="--Elija una asignatura--"
                    optionsList={asignaturas}
                    optKey="Clave_reticula"
                    optValue="Clave_reticula"
                    optTxt="Nombre_Materia"
                    hidden={false}
                />
            </div>
            <div className="form__short_inputs">
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
                                    /(?:^[A-Z]{1}[0-9]{1}[A-Z]{1}$)/;

                                if (newGradoGrupo.match(rg) !== null) {
                                    setIsGradoGrupoBadFormat(false);
                                } else {
                                    newGradoGrupo = gradoGrupo;
                                    setIsGradoGrupoBadFormat(true);
                                }
                            }
                            setGradoGrupo(newGradoGrupo);
                        }}
                        maxLength={3}
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
                <label className={`${formEmptyFields["lista-grado-grupo"] ?
                        "form__field_error" : ""} ${isGradoGrupoBadFormat ?
                        "form__field_warn" : ""}`}
                >
                    <span>
                        Semana Programada:
                    </span>
                    <input
                        type={"week"}
                        name={"input-vgc-semana-programada"}
                        value={semanaProgramada}
                        onChange={e => {
                            let value = e.target.value;
                            console.log(`Semana Programada: ${value}`);
                            setSemanaProgramada(e.target.value)
                        }}
                        onKeyDown={e => e.preventDefault()}
                        min={"2000-01-01"}
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
            </div>
            <div className="form__short_inputs">
                <label>
                    <span>
                        Tema:
                    </span>
                    <input
                        type={"text"}
                        name={"input-vgc-tema"}
                        value={tema}
                        onChange={e => {
                            let value = e.target.value;
                            setTema(value);
                        }}
                        maxLength={60}
                    />
                </label>
            </div>
            <div className="form__short_inputs">
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
                    <legend>
                        RCMRRC
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
                    <legend>
                        CCEEID
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
            "disabled": Object.keys(registroGeneral).length === 0
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
            buttonsModalAgregarModificar={buttonsModalAgregarModificar}
            formulario={formulario}
            modalEliminar={modalEliminar}
            buttonsModalEliminar={buttonsModalEliminar}
        />
    )
}

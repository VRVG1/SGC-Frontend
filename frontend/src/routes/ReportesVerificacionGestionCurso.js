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

    const [academias, setAcademias] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);

    const [academia, setAcademia] = useState({});
    const [profesor, setProfesor] = useState({});
    const [asignatura, setAsignatura] = useState({});

    const [lastReporteID, setLastReporteID] = useState(1);
    const [reporteID, setReporteID] = useState("");

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

    const formulario = (
        <form>
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

import { useContext, useState, useEffect, useCallback } from "react";
import Menu from "../componentes/Menu";
import { AuthContext } from "./helpers/Auth/auth-context";
import getAllReportes from "./helpers/Reportes/getAllReportes";
import filtroPNC from "./helpers/Reportes/filtroPNC";
import Modal from "./modal/Modal";
import useUser from "./helpers/Auth/useUser";


const objDefaultRegistro = {
    "reportesRegistrados": {
        "idsReportes": []
    }
};

const objDefaultRegistrosEliminados = {
    ...objDefaultRegistro,
    "deletePNCs": []
}

const objDefaultReporte = {
    "linkedPNCs": []
}

const defaultFormEmptyFields = {
        "lista-reportes": false,
        "input-pnc-folio": false,
    };

function Reporte({
    nombreReporte,
    fechaRepoEntrega,
    registros,
    callbackBtnModificar,
    callbackBtnEliminar
}) {

    function handleBtnModificar(idRegistro, registro) {
        callbackBtnModificar(nombreReporte, idRegistro, registro);
    }

    function handleBtnEliminar(idRegistro, registro) {
        callbackBtnEliminar(nombreReporte, idRegistro, registro);
    }

    const pncsIDs = Object.keys(registros);
    const tableBody = pncsIDs.length === 0 ? (
        <div className="data__header">
            <h3>
                No se tiene ningún registro PNC registrado para el reporte
                "{nombreReporte}".
            </h3>
        </div>
    ) :
        pncsIDs.map(idPNC => {
            return <PNCFila
                        key={idPNC}
                        idRegistro={idPNC}
                        registro={registros[idPNC]}
                        callbackModificar={handleBtnModificar}
                        callbackEliminar={handleBtnEliminar}
                   />
        });
    const tituloTabla = `Productos No Conformes en "${nombreReporte}" (${fechaRepoEntrega})`;
    return (
        <div className="reporte__tabla">
            <table>
                <thead>
                    <tr>
                        <th colSpan={7}>{tituloTabla}</th>
                    </tr>
                    <tr>
                        <th rowSpan={2}>No.</th>
                        <th rowSpan={2}>Folio</th>
                        <th rowSpan={2}>Fecha de Registro</th>
                        <th rowSpan={2}>Especificación Incumplida</th>
                        <th rowSpan={2}>Acción Implantada</th>
                        <th colSpan={2}>Elimina PNC</th>
                        <th
                            colSpan={2}
                            rowSpan={2}
                            className="reporte__tabla__empty_header"
                        ></th>
                    </tr>
                    <tr>
                        <th>Si</th>
                        <th>No</th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </table>
        </div>
    );
}

function PNCFila({
    idRegistro,
    registro,
    callbackModificar,
    callbackEliminar
}) {
    const {
        numeroPNC,
        folio,
        fechaRegistro,
        especIncumplida,
        accionImplantada,
        isEliminaPNC
    } = registro;

    return (
        <tr>
            <td>{numeroPNC}</td>
            <td>{folio}</td>
            <td>{fechaRegistro}</td>
            <td>{especIncumplida}</td>
            <td>{accionImplantada}</td>
            <td>{ isEliminaPNC ? "X" : " " }</td>
            <td>{ !isEliminaPNC ? "X" : " " }</td>
            <td>
                <button
                    onClick={() => {
                        // Llamar a una funcion que asigne los datos en
                        // los estados de 'ReportesProductosNoConformes'
                        callbackModificar(idRegistro, registro);
                    }}
                >
                    Modificar
                </button>
            </td>
            <td>
                <button
                    onClick={() => {
                        // Llamar a una función que agregue el
                        // parametro registro al estado
                        // 'registrosEliminados' de 
                        // 'ReportesProductosNoConformes'
                        callbackEliminar(idRegistro, registro);
                    }}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    );
}

export default function ReportesProductosNoConformes() {
    let auth = useContext(AuthContext);
    /**
        Estados-Contexto de ReportesProductosNoConformes:

        reportes:
            --> Arreglo de objetos. Almacena todos los reportes existentes en
                la DB.

        registroServidor:
            --> Objeto de objetos. Almacena un objeto que contiene multiples
                objetos, estos tienen distintas estructuras. Como tal, se
                tendran 3 objetos con estructuras distintas:

                reportesRegistrados:
                    =>  Objeto. Unicamente aparece una sola vez dentro del
                        registro, contendrá un único atributo "idsReportes".

                        "idsReportes":
                            ->  Arreglo de strings. Contendrá los ids de todos
                                los objetos de tipo reporte presentes en
                                'registroServidor'.

                reporte_<ID_REPORTE>:
                    =>  Objeto de tipo reporte. Puede aparecer más de una vez
                        dentro de 'registroServidor' pero con un ID distinto,
                        contendrá un único atributo "linkedPNCs".

                        "linkedPNCs":
                            ->  Arreglo de strings. Contendrá los ids de todos
                                los objetos de tipo pnc presentes en
                                'registroServidor'.

                pnc_<ID_PNC>:
                    =>  Objeto de tipo pnc. Puede aparecer más de una vez
                        dentro de 'registroServidor' pero con un ID distinto,
                        contendrá 6 atributos:

                        "numeroPNC":
                            ->  Int. El número que le corresponde al objeto con
                                relación al reporte.

                        "folio":
                            ->  String. Folio de la materia de la cual se esta
                                haciendo el PNC.

                        "fechaRegistro":
                            ->  String. Fecha en la cual se hizo el registro
                                de este objeto. El formato del string será
                                yyyy-mm-dd.

                        "especIncumplida":
                            ->  String. Contendrá el texto ingresado por el
                                usuario, en donde define los datos que se
                                incumplieron con dicho PNC.

                        "accionImplantada":
                            ->  String. Contendrá el texto ingresado por el
                                usuario, en donde define la acción implantada
                                para dicho PNC.

                        "isEliminaPNC":
                            ->  Booleano. Booleano que define si el PNC será
                                eliminado o no.
                
                La estructura del objeto será la siguiente:
                
                {
                    "reportesRegistrados": {
                        "idsReportes": [
                            "reporte_<ID_REPORTE>",
                            ...
                        ]
                    },
                    "reporte_1": {
                        "linkedPNCs": [
                            "pnc_<ID_PNC>",
                            ...
                        ]
                    },
                    ...
                    "pnc_1": {
                        "numeroPNC": numero,
                        "folio": string,
                        "fechaRegistro": string date ("yyyy-mm-dd"),
                        "especIncumplida": string,
                        "accionImplantada": string,
                        "isEliminaPNC": booleano
                    },
                    ...
                    "reporte_n": {
                        "linkedPNCs": [...]
                    },
                    ...
                    "pnc_n": { ... }
                }

        registrosAgregados:
            --> Objeto de objetos. Objeto que almacena todos los registros PNCs
                agregados por el usuario.

                Almacena un objeto que contiene multiples objetos, estos tienen
                distintas estructuras. Como tal, la estructura del objeto es
                igual a la de 'registroServidor'.

        registrosModificados:
            --> Objeto de objetos. Objeto que almacena todos los registros PNCs
                modificados por el usuario.

                Almacena un objeto que contiene multiples objetos, estos tienen
                distintas estructuras. Como tal, la estructura del objeto es
                igual a la de 'registroServidor'.

        registrosEliminados:
            --> Objeto de objetos. Objeto que almacena el ID de los registros
                PNCs eliminados por el usuario.

                Almacena un objeto que contiene multiples objetos, estos tienen
                distintas estructuras. Como tal, la estructura del objeto es
                similar a la de 'registroServidor'.
                A diferencia de los otros registros (registroServidor,
                registrosAgregados, registrosModificados), este registro no
                necesita almacenar objetos de tipo pnc. En su lugar, utiliza
                un atributo como arreglo:

                deletePNCs:
                    =>  Arreglo de strings. Contendrá los ids de todos los
                        objetos de tipo pnc que fueron eliminados por el
                        usuario.
                        
                        La estructura seria:
                        
                        deletePNCs: [
                            "pnc_<ID_PNC>",
                            ...
                        ]


        isDownloadable:
            --> Booleano. Cambia su valor cuando se obtiene el arreglo de
                          registroServidor, si el servidor retorna un arreglo
                          vacío este permanece en false, de lo contrario true.
        
        isAdding:
            --> Booleano. Cambia su valor cuando se presiona el boton de
                          Agregar.
        isUpdating:
            --> Booleano. Cambia su valor cuando se presiona el boton 
                          "Modificar" de alguno de los registros 
                          (registroServidor, registrosAgregados,
                          registrosModificados).
        hasChanges:
            --> Booleano. Cambia su valor cuando se efectúa algún cambio en los
                          registros (registroServidor, registrosAgregados,
                          registrosModificados, registrosEliminados).

        showModal:
            --> Booleano. Cambia su valor cuando se presiona el boton de
                          agregar o modificar.
    **/
    const [reportes, setReportes] = useState([]);
    // registros
    const [registroGeneral, setRegistroGeneral] = useState(objDefaultRegistro);
    const [registroServidor, setRegistroServidor] = useState(objDefaultRegistro);
    const [registrosAgregados, setRegistroAgregados] = useState(objDefaultRegistro);
    const [registrosModificados, setRegistrosModificados] = useState(objDefaultRegistro);
    const [registrosEliminados, setRegistrosEliminados] = useState(objDefaultRegistrosEliminados);
    // flags
    const [isDownloadable, setIsDownloadable] = useState(false);
    const [isAdding, setIsAdding] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isFolioBadFormat, setIsFolioBadFormat] = useState(false);
    const [formEmptyFields, setFormEmptyFields] = useState(defaultFormEmptyFields);
    // String
    const [folioNotifyMsg, setFolioNotifyMsg] = useState("");
    /**
        Estados para registrar/modificar PNC:

        actualPNCID:
            --> Int. Contador de registros agregados, representa el último ID
                registrado.

        pncID:
            --> String. Representa el ID del PNC que esta por ser agregado o
                modificado. El valor que contendrá al momento de agregar va a
                tener el siguiente formato:

                                "pnc_<actualPNCID>"

        noPNC:
            --> String|Int. Representa el número que le corresponde al PNC de 
                un Reporte. El número que contendrá cambiará según el reporte
                que se seleccione, mientras no sea seleccionado ningún reporte
                esta variable permanecerá como un string vacío ("").

        fechaRegistro:
            --> String. Almacena la fecha (en formato string) del día en el que
                el usuario creo el reporte PNC.

                El formato de la fecha es:
                
                                    yyyy-mm-dd

        reporte:
            --> Objeto. Almacena el objeto del reporte seleccionado en el menú
                de agregar.

                La estructura del objeto es la siguiente:
                
                {
                    "ID_Reporte": numero,
                    "Nombre_Reporte": string,
                    "fecha_Entrega": string date ("yyyy-mm-dd"),
                    "Descripcion": string,
                    "Opcional": booleano,
                    "Unidad": booleano,
                    "Calificaciones": booleano
                }

        folio:
            --> String. Almacena el folio ingresado por el usuario. El formato
                suele ser:
                        AAAXXX
                Donde:
                    => AAA -> Representa las 3 letras que definen a una
                              carrera, e.g:
                                IND -> Industrial
                                MEC -> Mecanica
                                INF -> Informatica
                                ISC -> Ing. Sistemas Computacionales
                    => XXX -> Representa el número de la materia relacionada
                              con la carrera, e.g:
                                001
                                002
                                ...
                                043
                                ...
                                XXX

        especIncumplida:
            --> String. Almacena la 'especificación incumplida' ingresada por
                el usuario. Suele ser una cadena de caracteres muy
                grande.

        accionImplantada:
            --> String. Almacena la 'acción implantada' ingresada por el
                usuario. Suele ser una cadena de caracteres muy grande.

        isEliminaPNC:
            --> Booleano. Booleano que define que input de tipo radio
                fue seleccionado por el usuario.
    **/
    const [actualPNCID, setActualPNCID] = useState(1);
    const [pncID, setPncId] = useState("pnc_1");
    const [noPNC, setNoPNC] = useState("");
    const [fechaRegistro, setFechaRegistro] = useState(new Date().toISOString().split('T')[0]);
    const [oldReporte, setOldReporte] = useState({});
    const [reporte, setReporte] = useState({});
    const [folio, setFolio] = useState("");
    const [especIncumplida, setEspecIncumplida] = useState("");
    const [accionImplantada, setAccionImplantada] = useState("");
    const [isEliminaPNC, setIsEliminaPNC] = useState(true);

    const obtenerReportes = useCallback(() => {
        getAllReportes(auth.user.token).then(data => {
            setReportes(data)
        });
    }, [setReportes]);

    const obtenerRegistroPNC = () => {
        filtroPNC(auth.user.token, "", "getRegistro").then(res => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        }).then(rcvData => {
            // Se reciben todos los registros PNC en el servidor
            if (rcvData !== null) {
                const lastPNCID = rcvData.lastPNCID;
                const registro = rcvData.registro;
                setActualPNCID(lastPNCID);
                setPncId(`pnc_${lastPNCID}`);

                setRegistroGeneral(registro);
            }
        }).catch(error => {
            console.log("ERROR");
            console.log(error.message);
        });
    };

    useEffect(obtenerReportes, [setReportes]);
    useEffect(obtenerRegistroPNC, [reportes, setActualPNCID, setPncId, setRegistroGeneral]);

    function addPNC(registro) {
        console.log("ADD PNC");
        filtroPNC(auth.user.token, registro, "agregar").then(res => {
            console.log(`RES OK? ${res.ok}`);
            console.log(`RES STATUS: ${res.status}`);
            if (!res.ok) {
                return null;
            }
            return res.json();
        }).then(registro => {
            console.log("Received Data:");
            console.log(registro);
        }).catch(error => {
            console.log("ERROR");
            console.log(error.message);
        });
    }

    function updatePNC(registro) {
        filtroPNC(auth.user.token, registro, "modificar").then(res => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        }).then(registro => {
            console.log(registro);
        }).catch(error => {
            console.log(error.message);
        });
    }

    function deletePNC(registro) {
        filtroPNC(auth.user.token, registro, "eliminar").then(res => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        }).then(registro => {
            console.log(registro);
        }).catch(error => {
            console.log(error.message);
        });
    }

    function setAddingModal(change) {
        setIsAdding(change);
        setShowModal(change);
    }
    function setUpdatingModal(change) {
        setIsUpdating(change);
        setShowModal(change);
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
            updatingEstadosRegistro();
            setIsFolioBadFormat(false);
            setFormEmptyFields(defaultFormEmptyFields);
        }
    }

    function updatingEstadosRegistro({
        newReporte = {},
        pncID = actualPNCID,
        numeroPNC = "",
        folio = "",
        fechaRegistro = new Date().toISOString().split('T')[0],
        especIncumplida = "",
        accionImplantada = "",
        isEliminaPNC = true
    } = {}) {
        setOldReporte(newReporte);
        setReporte(newReporte);
        setPncId(pncID);
        setNoPNC(numeroPNC);
        setFolio(folio);
        setFechaRegistro(fechaRegistro);
        setEspecIncumplida(especIncumplida);
        setAccionImplantada(accionImplantada);
        setIsEliminaPNC(isEliminaPNC);
    }

    function modificarEstadosRegistro(nombreReporte, idRegistro, registro) {
        const reporteAux = reportes.find(reporteObj => {
            return reporteObj['Nombre_Reporte'] === nombreReporte
        });
        console.log(reporteAux);

        updatingEstadosRegistro({newReporte: reporteAux, pncID: idRegistro, ...registro});
        // Activa el componente Modal y activa la flag isUpdating
        setUpdatingModal(true);
    }

    function agregarRegistroEliminado(nombreReporte, idRegistro, registro) {
        // TODO: Al momento de agregar un elemento a 'registrosEliminados'
        //       se debe tener especial cuidado de revisar los estados de
        //       registros (registroServidor, registrosAgregados,
        //       registrosModificados).
    }

    const flagErrorWarnMsg = !formEmptyFields["input-pnc-folio"] && !isFolioBadFormat;
    const formulario = (
        <form>
            <div className={`form__menu_reportes ${formEmptyFields["lista-reportes"] ? "form__field_error" : ""}`}>
                <Menu
                    labelTxt="*Reportes:"
                    selectId="menu-reportes"
                    selectName="lista-reportes"
                    selectFn={(event) => {
                        let value = event.target.value;
                        if (value !== "") {
                            if (formEmptyFields["lista-reportes"]) {
                                setFormEmptyFields({
                                    ...formEmptyFields,
                                    "lista-reportes": false
                                });
                            }
                            let idReporte = parseInt(value);
                            const reporteAux = reportes.find(reporteObj => {
                                return reporteObj["ID_Reporte"] === idReporte;
                            });
                            setReporte(reporteAux);
                            if (isAdding) {
                                const registrosReporte = registroGeneral[`reporte_${idReporte}`];
                                console.log(registrosReporte)
                                let numeroPNC = 1;
                                if (registrosReporte !== undefined) {
                                    numeroPNC = registrosReporte["linkedPNCs"].length + 1;
                                }
                                setNoPNC(numeroPNC);
                            }
                        } else {
                            setReporte({});
                            setNoPNC("");
                        }
                    }}
                    selectValue={Object.keys(reporte).length === 0 ? "" : reporte['ID_Reporte']}
                    defaultOptionTxt="--Elija un reporte--"
                    optionsList={reportes}
                    optKey="ID_Reporte"
                    optValue="ID_Reporte"
                    optTxt="Nombre_Reporte"
                    hidden={false}
                />
                <div className={"form__error_message"} hidden={!formEmptyFields["lista-reportes"]}>
                    <h5 hidden={!formEmptyFields["lista-reportes"]}>
                        Debe seleccionar un reporte antes de guardar
                    </h5>
                </div>
            </div>
            <div className="form__short_inputs">
                <label>
                    <span>
                        No.
                    </span>
                    <input
                        type={"number"}
                        name={"input-pnc-num"}
                        value={noPNC}
                        disabled={true}
                    />
                </label>
                <label>
                    <span>
                        Fecha Registro:
                    </span>
                    <input
                        type={"date"}
                        name={"input-pnc-fecha"}
                        value={fechaRegistro}
                        onChange={(e) => setFechaRegistro(e.target.value)}
                        onKeyDown={(e) => e.preventDefault()}
                        min={"2000-01-01"}
                    />
                </label>
                <label className={`${formEmptyFields["input-pnc-folio"] ?
                        "form__field_error" : ""} ${isFolioBadFormat ? "form__field_warn" : ""}`}>
                    <span>
                        *Folio:
                    </span>
                    <input
                        type={"text"}
                        name={"input-pnc-folio"}
                        value={folio}
                        onChange={(e) => {
                            let newFolio = e.target.value;
                            if (formEmptyFields["input-pnc-folio"]) {
                                if (newFolio !== "") {
                                    setFormEmptyFields({
                                        ...formEmptyFields,
                                        "input-pnc-folio": false
                                    });
                                }
                            } 
                            if (newFolio !== "") {
                                newFolio = newFolio.toUpperCase();
                                let rg = newFolio.length <= 3 ?
                                    /(?:^[A-Z]{1,3}$)/ :
                                    /(?:^[A-Z]{3}[0-9]{1,3}$)/
                                // TODO: Hacer que, si newFolio.match(rg) es null,
                                //       notifique al usuario sobre el formato del
                                //       folio.
                                if (newFolio.match(rg) !== null) {
                                    newFolio = newFolio;
                                    setIsFolioBadFormat(false);
                                } else {
                                    newFolio = folio;
                                    setIsFolioBadFormat(true);
                                }
                                // newFolio = newFolio.match(rg) !== null ? newFolio : folio;
                            }
                            setFolio(newFolio)
                        }}
                        maxLength={6}
                    />
                    <div
                        className={`${formEmptyFields["input-pnc-folio"] ?
                                "form__error_message": ""} ${isFolioBadFormat ? "form__warn_message" : ""}`}
                        hidden={flagErrorWarnMsg}
                    >
                        <h5 hidden={flagErrorWarnMsg}>
                            {folioNotifyMsg}
                        </h5>
                    </div>
                </label>
            </div>
            <div className="form__large_inputs">
                <div className="form__large_inputs__textarea">
                    <label>
                        <span>
                            Especificación Incumplida:
                        </span>
                        <textarea
                            name={"input-pnc-especificacion-incumplida"}
                            value={especIncumplida}
                            onChange={(e) => setEspecIncumplida(e.target.value)}
                        />
                    </label>
                </div>
                <div className="form__large_inputs__textarea">
                    <label>
                        <span>
                            Acción Implantada:
                        </span>
                        <textarea
                            name={"input-pnc-accion-implantada"}
                            value={accionImplantada}
                            onChange={(e) => setAccionImplantada(e.target.value)}
                        />
                    </label>
                </div>
            </div>
            <fieldset>
                <legend>
                    Eliminar PNC:
                </legend>
                <div>
                    <label htmlFor={"rSi"}>
                        Si
                    </label>
                    <input
                        type={"radio"}
                        id={"rSi"}
                        name={"radio-si"}
                        value={"Si"}
                        checked={isEliminaPNC}
                        onChange={() => {
                            setIsEliminaPNC(true);
                        }}
                    />
                </div>
                <div>
                    <label htmlFor={"rNo"}>
                        No
                    </label>
                    <input
                        type={"radio"}
                        id={"rNo"}
                        name={"radio-no"}
                        value={"No"}
                        checked={!isEliminaPNC}
                        onChange={() => {
                            setIsEliminaPNC(false);
                        }}
                    />
                </div>
            </fieldset>
        </form>
    );

    const BloqueRegistros = () => {
        let contenido

        const idsReportes = registroGeneral["reportesRegistrados"]["idsReportes"];
        if (idsReportes !== undefined && idsReportes.length !== 0) {
            contenido = idsReportes.map((formatIdReporte, idx) => {
                const idReporte = parseInt(formatIdReporte.split('_')[1]);
                const reporteAux = reportes.find(obj => obj.ID_Reporte === idReporte);
                if (reporteAux !== undefined) {
                    console.log("Reporte Aux:");
                    console.log(reporteAux);
                    const linkedPNCsIds = registroGeneral[formatIdReporte]["linkedPNCs"];
                    const pncs = {};
                    linkedPNCsIds.forEach(idPNC => {
                        pncs[idPNC] = registroGeneral[idPNC];
                    });
                    return <Reporte
                        key={`ReporteTabla__${idx}`}
                        nombreReporte={reporteAux["Nombre_Reporte"]}
                        fechaRepoEntrega={reporteAux["Fecha_Entrega"]}
                        registros={pncs}
                        callbackBtnModificar={modificarEstadosRegistro}
                        callbackBtnEliminar={agregarRegistroEliminado}
                    />
                }
                return (
                    <div key={`ReporteTabla_${idx}`} className="data__body__reportes_display">
                        <h3>Todavía no hay ningún PNC registrado.</h3>
                    </div>
                );
            });
        }

        return (
            <div className="data__body__reportes">
                {contenido}
            </div>
        );
    }
    const botones = (
        <div className="data__body__buttons">
            <button
                onClick={() => {
                    // Activa el componente Modal y la flag isAdding
                    setAddingModal(true);
                }}
            >
                <span>Agregar</span>
            </button>
            <button
                onClick={() => {
                    // TODO: Al hacer clic hacer que mande el objeto con todos
                    //       los nuevos registros al backend.
                }}
                disabled={
                    // TODO: Mantener desactivado si no hay cambios en el
                    //       reporte.
                    hasChanges
                }
            >
                <span>Guardar</span>
            </button>
            <button
                onClick={() => {
                    // TODO: Al hacer clic que permita descargar el registro
                    //       del reporte en formato PDF.
                }}
                disabled={
                    // TODO: Mantener desactivado si no se tienen datos en el
                    //       backend
                    Object.keys(registroServidor).length === 0
                }
            >
                <span>Descargar</span>
            </button>
        </div>
    );

    const modal = (
        <Modal
            show={showModal}
            setShow={setFlagsModal}
            title={"Agregar PNC"}
        >
            <div className="modal__content">
                {formulario}
                <div className="modal__content__buttons">
                    <button
                        onClick={() => {
                            // TODO: ¿Cómo saber si un PNC de un reporte X es
                            //       cambiado a ser de un reporte Y? Cambiar la
                            //       estructura de los estados o incorporar
                            //       alguna funcion que facilite el borrar
                            //       aquellos PNC modificados a otro reporte.
                            
                            if (Object.keys(reporte).length === 0 || folio === "") {
                                let flagMenuReportes = Object.keys(reporte).length === 0;
                                let flagFolioInput = folio === "";

                                if (flagFolioInput) {
                                    setFolioNotifyMsg("Debe proporcionar un Folio antes de guardar");
                                }
                                if (isFolioBadFormat) {
                                    setIsFolioBadFormat(false);
                                }
                                setFormEmptyFields({
                                    ["lista-reportes"]: flagMenuReportes,
                                    ["input-pnc-folio"]: flagFolioInput
                                });
                                return;
                            } else {
                                setFormEmptyFields(defaultFormEmptyFields);
                            }

                            let folioRgExp = /(?:^[A-Z]{3}[0-9]{3}$)/;
                            if (folio.match(folioRgExp) === null) {
                                setFolioNotifyMsg("Folio no valido. Debe contener por lo menos 3 letras y 3 números.")
                                setIsFolioBadFormat(true);
                                return;
                            } else {
                                setIsFolioBadFormat(false);
                            }
                            const idReporte = `reporte_${reporte["ID_Reporte"]}`;
                            let registrosReporte = {};
                            let newPncID = actualPNCID;
                            let newPNC = {
                                    "numeroPNC": noPNC,
                                    "folio": folio,
                                    "fechaRegistro": fechaRegistro,
                                    "especIncumplida": especIncumplida,
                                    "accionImplantada": accionImplantada,
                                    "isEliminaPNC": isEliminaPNC
                                };

                            const data2Send = {
                                lastPNCID: actualPNCID,
                                registro: {}
                            }
                            let nextReporteRegistros = {};
                            if (isAdding) {
                                // El usuario esta agregando un PNC

                                // Se obtiene el objeto relacionado a idReporte
                                registrosReporte = registroGeneral[idReporte];
                                if (registrosReporte === undefined) {
                                    // Si el registro del reporte es undefined quiere
                                    // decir que no ha sido creado algun PNC para dicho
                                    // reporte en 'registroGeneral'
                                    const idsReportes = [
                                        ...registroGeneral["reportesRegistrados"]["idsReportes"],
                                        idReporte
                                    ];
                                    nextReporteRegistros = {
                                        //...registrosAgregados,
                                        "reportesRegistrados": {
                                            "idsReportes": [...idsReportes]
                                        },
                                        [idReporte]: {
                                            "linkedPNCs": [pncID]
                                        },
                                        [pncID]: newPNC
                                    };
                                } else {
                                    // Si el registro del reporte no es undefined
                                    // quiere decir que existe algun PNC para dicho
                                    // reporte.
                                    nextReporteRegistros = {
                                        //...registrosAgregados,
                                        [idReporte]: {
                                            "linkedPNCs": [
                                                ...registrosReporte["linkedPNCs"],
                                                pncID
                                            ]
                                        },
                                        [pncID]: newPNC
                                    };
                                }
                                //setRegistroAgregados(nextReporteRegistros);
                                // TODO: Llamar fillRegistros y pasar por
                                //       parametro nextReporteRegistros

                                data2Send.lastPNCID = actualPNCID + 1;
                                data2Send.registro = nextReporteRegistros;
                                addPNC(data2Send);
                                setActualPNCID(actualPNCID + 1);
                                // setPncId(pncID + 1);
                                newPncID = actualPNCID + 1;
                            } else if (isUpdating) {
                                // El usuario esta modificando un PNC existente
                                
                                // Se obtiene el id del reporte espejo
                                const idOldReporte = `reporte_${oldReporte["ID_Reporte"]}`;
                                // Se obtiene el objeto relacionado al
                                // 'idReporte' en registrosModificados
                                registrosReporte = registroGeneral[idReporte];

                                // Si el idReporte es distinto al idOldReporte
                                // quiere decir que el PNC que se esta modificando
                                // fue cambiado a otro reporte
                                if (idReporte !== idOldReporte) {
                                    // El PNC en modificación fue cambiado a
                                    // otro reporte
                                    
                                    // Se obtiene el objeto relacionado al 'idOldReporte'
                                    // Se sabe que este no puede estar vacío porque
                                    // ya existía en algun registro (registroServidor,
                                    // registrosAgregados o registrosModificados).

                                    // Se obtiene el objeto relacionado al 'idOldReporte'
                                    // del 'registrosModificados'
                                    let oldReporteRegistro = registroGeneral[idOldReporte];
                                    // Se declara un arreglo nuevo para contener la versión
                                    // actualizada del linkedPNCs del oldReporte
                                    let oldReporteIdPNC = [];
                                    // Función que asigna a oldReporteIdPNC un nuevo
                                    // arreglo con todos los linkedPNCs del oldReporte
                                    // cuyos ids no sean iguales a pncID
                                    const getOldReporteIdPNC = () => {
                                        oldReporteIdPNC = oldReporteRegistro["linkedPNCs"].filter(idPNC => {
                                            return idPNC !== pncID;
                                        });
                                    }
                                    // TODO: Considerar en eliminar este bloque
                                    //       de codigo.
                                    //
                                    // Si oldReporteRegistro es undefined quiere decir
                                    // que oldReporte no esta definido en registrosModificados
                                    if (oldReporteRegistro === undefined) {
                                        // Se agrega el id de oldReporte a
                                        // idsReportes en reportesRegistrados del proximo
                                        // registrosModificados
                                        const idReportes = [
                                            ...registrosModificados["reportesRegistrados"]["idsReportes"],
                                            idOldReporte
                                        ];
                                        nextReporteRegistros["reportesRegistrados"] = {
                                            "idsReportes": [...idReportes]
                                        };
                                        // Al no estar registrado el oldReporte
                                        // en registrosModificados se procede a
                                        // buscar en los otros registros
                                        if (registrosAgregados[idOldReporte] !== undefined) {
                                            // Se asigna el oldReporte a oldReporteRegistro
                                            oldReporteRegistro = registrosAgregados[idOldReporte];
                                            // Se obtienen los linkedPNCs de oldReporte
                                            getOldReporteIdPNC();
                                        } else if (registroServidor !== undefined) {
                                            // Se asigna el oldReporte a oldReporteRegistro
                                            oldReporteRegistro = registroServidor[idOldReporte];
                                            // Se obtienen los linkedPNCs de oldReporte
                                            getOldReporteIdPNC();
                                        }
                                    } else {
                                        getOldReporteIdPNC();
                                    }
                                    nextReporteRegistros[idOldReporte] = {
                                        "linkedPNCs": [...oldReporteIdPNC]
                                    };
                                }
                                // Si no, significa que el PNC sigue estando
                                // relacionado con el oldReporte, por lo que no
                                // se hace ningun cambio en el oldReporte.

                                // Si registrosReporte es undefined quiere decir
                                // que idReporte no esta definido en registrosModificados
                                if (registrosReporte === undefined) {
                                    // Se agrega el idReporte a idsReportes en
                                    // reportesRegistrados del proximo
                                    // registrosModificados
                                    const idReportes = [
                                        ...registroGeneral["reportesRegistrados"]["idsReportes"],
                                        idReporte
                                    ];
                                    nextReporteRegistros["reportesRegistrados"] = {
                                        "idsReportes": [...idReportes]
                                    };
                                    // Se agrega dentro del atributo idReporte
                                    // un arreglo con el pncID del PNC modificado
                                    nextReporteRegistros[idReporte] = {
                                        "linkedPNCs": [pncID]
                                    };
                                } else {
                                    // Si registrosReporte no es undefined quiere decir
                                    // que idReporte esta definido en registrosModificados
                                    // Solo faltaría checar si en el atributo linkedPNCs
                                    // existe el pncID
                                    const hasPncId = registrosReporte["linkedPNCs"].find(idPNC => idPNC === pncID);
                                    // Si hasPncId es undefined quiere decir
                                    // que no existe pncID dentro de los linkedPNCs
                                    // de idReporte
                                    if (hasPncId === undefined) {
                                        nextReporteRegistros[idReporte] = {
                                            "linkedPNCs": [
                                                ...nextReporteRegistros[idReporte]["linkedPNCs"],
                                                pncID
                                            ]
                                        }
                                    }
                                    // Si hasPncId es distinto a undefined
                                    // quiere decir que pncID existe dentro de
                                    // los linkedPNCs de idReporte
                                }
                                // Por ultimo, se agrega en el atributo pncID
                                // el newPNC
                                nextReporteRegistros[pncID] = newPNC;
                                data2Send.lastPNCID = actualPNCID;
                                data2Send.registro = nextReporteRegistros;

                                updatePNC(data2Send);
                                //setRegistrosModificados(nextReporteRegistros);
                                // setPncId(actualPNCID);
                                newPncID = actualPNCID;
                                setUpdatingModal(false);
                            }
                            newPncID = `pnc_${newPncID}`;
                            updatingEstadosRegistro({pncID: newPncID});
                        }}
                    >
                        <span>Guardar</span>
                    </button>
                </div>
            </div>
        </Modal>
    );

    return (
        <>
            <div className="data">
                <div className="data__header">
                    <h1>Productos No Conformes</h1>
                </div>
                <div className="data__body container">
                    <BloqueRegistros/>
                    {botones}
                </div>
            </div>
            {modal}
        </>
    );
}

import { useContext, useState, useEffect, useCallback } from "react";
import Menu from "../componentes/Menu";
import { AuthContext } from "./helpers/Auth/auth-context";
import getAllReportes from "./helpers/Reportes/getAllReportes";
import filtroPNC from "./helpers/Reportes/filtroPNC";
import InterfazRegistros from "../componentes/InterfazRegistros";


const objDefaultRegistro = {
    "reportesRegistrados": {
        "idsReportes": []
    }
};

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
                        <th className="reporte__tabla__col_small" rowSpan={2}>No.</th>
                        <th className="reporte__tabla__col_folio" rowSpan={2}>Folio</th>
                        <th className="reporte__tabla__col_fecha_registro" rowSpan={2}>Fecha de Registro</th>
                        <th className="reporte__tabla__col_relevant" rowSpan={2}>Especificación Incumplida</th>
                        <th className="reporte__tabla__col_relevant" rowSpan={2}>Acción Implantada</th>
                        <th className="reporte__tabla__col_elimina_pnc" colSpan={2}>Elimina PNC</th>
                        <th
                            colSpan={2}
                            rowSpan={2}
                            className="reporte__tabla__empty_header"
                        ></th>
                    </tr>
                    <tr>
                        <th className="reporte__tabla__col_small">Si</th>
                        <th className="reporte__tabla__col_small">No</th>
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

    function TableData({customClassName="", children}) {
        return (
            <td className={customClassName}>
                <div className={`reporte__tabla__info`}>
                    {children}
                </div>
            </td>
        );
    }

    return (
        <tr>
            <TableData customClassName="reporte__tabla__col_small">
                {numeroPNC}
            </TableData>
            <TableData customClassName="reporte__tabla__col_folio">
                {folio}
            </TableData>
            <TableData customClassName="reporte__tabla__col_fecha_registro">
                {fechaRegistro}
            </TableData>
            <TableData customClassName="reporte__tabla__col_relevant reporte__tabla__info_to_left">
                {especIncumplida}
            </TableData>
            <TableData customClassName="reporte__tabla__col_relevant reporte__tabla__info_to_left">
                {accionImplantada}
            </TableData>
            <TableData customClassName="reporte__tabla__col_small">
                { isEliminaPNC ? "X" : " "}
            </TableData>
            <TableData customClassName="reporte__tabla__col_small">
                { !isEliminaPNC ? "X" : " "}
            </TableData>
            <TableData customClassName="reporte__tabla__info_td_hover">
                <button
                    onClick={() => {
                        // Llamar a una funcion que asigne los datos en
                        // los estados de 'ReportesProductosNoConformes'
                        callbackModificar(idRegistro, registro);
                    }}
                >
                    Modificar
                </button>
            </TableData>
            <TableData customClassName="reporte__tabla__info_td_hover">
                <button
                    className="button__eliminar"
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
            </TableData>
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

        registroGeneral:
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
        isNeededUpdate:
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
    // flags
    const [isDownloadable, setIsDownloadable] = useState(false);
    const [isAdding, setIsAdding] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false);
    const [isNeededUpdate, setIsNeededUpdate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalEliminar, setShowModalEliminar] = useState(false)
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
    const [oldNoPNC, setOldNoPNC] = useState("");
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
        console.log("ObtenerRegistroPNC...")
        filtroPNC(auth.user.token, "", "getRegistro").then(res => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        }).then(rcvData => {
            console.log(rcvData);
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
    useEffect(obtenerRegistroPNC, [isNeededUpdate, setActualPNCID, setPncId, setRegistroGeneral]);

    function addPNC(registro) {
        filtroPNC(auth.user.token, registro, "agregar").then(res => {
            if (res.ok) {
                updatingEstadosRegistro();
                // setActualPNCID(actualPNCID + 1)
            }
            return res.json();
        }).then(registro => {
            if (registro['Error'] !== undefined) {
                console.log("Error");
                console.log(registro['Error']);
            } else {
                setIsNeededUpdate(!isNeededUpdate);
            }
        }).catch(error => {
            console.log("ERROR");
            console.log(error.message);
        });
    }

    function updatePNC(registro) {
        filtroPNC(auth.user.token, registro, "modificar").then(res => {
            if (res.ok) {
                updatingEstadosRegistro();
                setUpdatingModal(false);
            }
            return res.json();
        }).then(registro => {
            if (registro['Error'] !== undefined) {
                console.log("Error");
                console.log(registro['Error']);
            } else {
                setIsNeededUpdate(!isNeededUpdate);
            }
        }).catch(error => {
            console.log(error.message);
        });
    }

    function deletePNC(registro) {
        filtroPNC(auth.user.token, registro, "eliminar").then(res => {
            if (res.ok) {
                setFlagModalEliminar(false);
            }
            return res.json();
        }).then(registro => {
            console.log(registro);
            if (registro['Error'] !== undefined) {
                console.log("Error");
                console.log(registro['Error']);
            } else {
                setIsNeededUpdate(!isNeededUpdate);
            }
        }).catch(error => {
            console.log(error.message);
        });
    }

    function downloadPDF() {
        filtroPNC(auth.user.token, "", "descargar").then(res => {
            console.log(res);
            if (res.ok) {
                console.log("descargando");
                return res.blob();
            } else {
                return res.json();
            }
        }).then(rcvData => {
            console.log(rcvData);
            if (rcvData instanceof Blob) {
                const objectURL = URL.createObjectURL(rcvData);
                window.open(objectURL, "_blank");
            } else if (rcvData instanceof Object) {
                console.log(rcvData["Error"]);
            }
        }).catch(error => {
            console.log(error);
        })
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

    function setFlagModalEliminar(change) {
        setShowModalEliminar(change);
        if (!change) {
            updatingEstadosRegistro();
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
        const formatPncID = `pnc_${pncID}`;
        setOldNoPNC(numeroPNC);
        setOldReporte(newReporte);
        setReporte(newReporte);
        setPncId(formatPncID);
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

        const numIdRegistro = idRegistro.split('_')[1];
        updatingEstadosRegistro({
            newReporte: reporteAux,
            pncID: numIdRegistro,
            ...registro
        });
        // Activa el componente Modal y activa la flag isUpdating
        setUpdatingModal(true);
    }

    function agregarRegistroEliminado(nombreReporte, idRegistro, registro) {
        const reporteAux = reportes.find(reporteObj => {
            return reporteObj['Nombre_Reporte'] === nombreReporte;
        });
        const numIdRegistro = idRegistro.split('_')[1];
        updatingEstadosRegistro({
            newReporte: reporteAux,
            pncID: numIdRegistro,
            ...registro
        });
        setFlagModalEliminar(true);
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

                            // En base al reporte seleccionado se selecciona un
                            // nuevo NoPNC (Número de registro del PNC).
                            //
                            // Se obtiene del registroGeneral el registro del
                            // reporte que concuerde con el ID del reporte
                            // seleccionado
                            const registrosReporte = registroGeneral[`reporte_${idReporte}`];
                            // Se crea la variable auxiliar 'numeroPNC'
                            // inicializada en 1 para, en caso de que no exista
                            // el reporte en registroGeneral, que este sea su
                            // primer reporte PNC.
                            let numeroPNC = 1;
                            // Se verifica si el registro de reporte obtenido
                            // de registroGeneral existe
                            if (registrosReporte !== undefined) {
                                // Si existe, se toma el número de elementos
                                // presentes en su linkedPNCs y se le agrega
                                // uno (ya que va a haber un nuevo elemento)
                                numeroPNC = registrosReporte["linkedPNCs"].length + 1;
                            }
                            // En caso de que se este modificando un PNC
                            // se debe considerar si el ID_Reporte del
                            // reporteAux es igual al de oldReporte
                            if (isUpdating) {
                                if (reporteAux["ID_Reporte"] === oldReporte["ID_Reporte"]) {
                                    // Al ser identicos, quiere decir que el
                                    // usuario selecciono el reporte original por
                                    // lo que vuelve a tener su viejo numeroPNC
                                    numeroPNC = oldNoPNC;
                                }
                            }
                            setNoPNC(numeroPNC);
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
                                    setFolioNotifyMsg("");
                                } else {
                                    newFolio = folio;
                                    setIsFolioBadFormat(true);
                                    setFolioNotifyMsg("Folio no valido. Debe contener por lo menos 3 letras y 3 números.");
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
        let contenido = "";
        let containsNoString = false;
        let contenidoEmpty = (
            <div className="data__body__reportes_display">
                <h3>Todavía no hay ningún PNC registrado.</h3>
            </div>
        );

        const idsReportes = registroGeneral["reportesRegistrados"]["idsReportes"];
        if (idsReportes !== undefined && idsReportes.length !== 0) {
            contenido = idsReportes.map((formatIdReporte, idx) => {
                const idReporte = parseInt(formatIdReporte.split('_')[1]);
                const reporteAux = reportes.find(obj => obj.ID_Reporte === idReporte);
                if (reporteAux !== undefined) {
                    const linkedPNCsIds = registroGeneral[formatIdReporte]["linkedPNCs"];
                    const pncs = {};
                    linkedPNCsIds.forEach(idPNC => {
                        pncs[idPNC] = registroGeneral[idPNC];
                    });
                    if (Object.keys(pncs).length === 0) {
                        return "";
                    } else {
                        containsNoString = true;
                        return (
                            <Reporte
                                key={`ReporteTabla__${idx}`}
                                nombreReporte={reporteAux["Nombre_Reporte"]}
                                fechaRepoEntrega={reporteAux["Fecha_Entrega"]}
                                registros={pncs}
                                callbackBtnModificar={modificarEstadosRegistro}
                                callbackBtnEliminar={agregarRegistroEliminado}
                            />
                        );
                    }
                }
            });
        }
        if (!containsNoString) {
            contenido = contenidoEmpty;
        }

        return (
            <div className="data__body__reportes">
                {contenido}
            </div>
        );
    }

    function handleBtnAgregar() {
        setAddingModal(true);
    }

    function handleBtnGuardarModal() {
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
        console.log(folioRgExp);
        if (folio.match(folioRgExp) === null) {
            setFolioNotifyMsg("Folio no valido. Debe contener por lo menos 3 letras y 3 números.")
            setIsFolioBadFormat(true);
            return;
        } else {
            setIsFolioBadFormat(false);
        }
        let newPNC = {
            "numeroPNC": noPNC,
            "folio": folio,
            "fechaRegistro": fechaRegistro,
            "especIncumplida": especIncumplida,
            "accionImplantada": accionImplantada,
            "isEliminaPNC": isEliminaPNC
        };

        // Se agrega el ID del reporte al cual se esta agregando/modificando
        // y el contenido del nuevo PNC
        let data2Send = {
            'ID_reporte': reporte["ID_Reporte"],
            'new_PNC': newPNC
        };
        if (isAdding) {
            // El usuario esta agregando un PNC

            // Se envían el registro PNC a agregar al
            // servidor.
            addPNC(data2Send);
        } else if (isUpdating) {
            // El usuario esta modificando un PNC existente
            
            // Se crea un nuevo atributo dentro de data2Send, 'ID_pnc'
            // almacenará el ID del pnc que fue modificado
            data2Send['ID_pnc'] = pncID;

            // Si el idReporte es distinto al idOldReporte
            // quiere decir que el PNC que se esta modificando
            // fue cambiado a otro reporte
            if (reporte['ID_Reporte'] != oldReporte['ID_Reporte']) {
                // Por ello, se agrega un nuevo atributo a data2Send, 
                // 'ID_old_reporte' contendrá el ID puro (numero) del reporte
                // al que antes pertenecia el PNC.
                data2Send['ID_old_reporte'] = oldReporte['ID_Reporte'];
            }

            // Se envían los datos al servidor
            updatePNC(data2Send);
        }
    }

    function handleBtnEliminarModal() {
        // Estructura del nextRegistroEliminar:
        // {
        //      "reporte_<ID>": {
        //          "linkedPNCs": [
        //              contendrá todos los pnc's menos
        //              el del pnc que se eliminará
        //          ]
        //      },
        //      "pnc_<ID>": "pnc_id" <- El id del pnc a eliminar
        // }
        const idReporte = `reporte_${reporte["ID_Reporte"]}`;
        let registroReporte = registroGeneral[idReporte];
        
        const newLinkedPNCs = registroReporte["linkedPNCs"].filter(idPNC => {
            return idPNC !== pncID;
        });
        const data2Send = {
            "ID_reporte": reporte["ID_Reporte"],
            'ID_pnc': pncID
        };
        deletePNC(data2Send);
    }

    function handleBtnCancelarModal() {
        setFlagModalEliminar(false);
    }

    const guiTitle = "Productos No Conformes";

    const bloqueRegistros = <BloqueRegistros/>

    const buttonsDataBody = [
        {
            "id": "btnAgregar",
            "handler": handleBtnAgregar,
            "btnTxt": "Agregar"
        },
        {
            "id": "btnDescargar",
            "handler": downloadPDF,
            "btnTxt": "Descargar",
            // Por defecto el registro General contiene
            // "reportesRegistrados" por lo que un registro general
            // vacío contendría unicamente 1 key
            "disabled": Object.keys(registroGeneral).length === 1
        }
    ];
    const modalAgregarModificar = {
        "show": showModal,
        "setShow": setFlagsModal,
        "title": "Agregar PNC"
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
        "title": "¿Desea eliminar el PNC?"
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
            buttonsDataBody={buttonsDataBody}
            modalAgregarModificar={modalAgregarModificar}
            buttonsModalAgregarModificar={buttonsModalAgregarModificar}
            formulario={formulario}
            modalEliminar={modalEliminar}
            buttonsModalEliminar={buttonsModalEliminar}
        >
            {bloqueRegistros}
        </InterfazRegistros>
    );
}

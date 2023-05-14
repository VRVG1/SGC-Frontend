import { useContext, useState, useEffect, useCallback } from "react";
import Menu from "../componentes/Menu";
import { AuthContext } from "./helpers/Auth/auth-context";
import getAllReportes from "./helpers/Reportes/getAllReportes";
import Modal from "./modal/Modal";


const checkStateRadioInput = {
    "radio-si": true,
    "radio-no": false
};

function Reporte({
    nombreReporte,
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

    const idsRegistros = Object.keys(registros);
    const tableBody = idsRegistros.length === 0 ? (
        <div className="data__header">
            <h3>
                No se tiene ningún registro PNC registrado para el reporte
                "{nombreReporte}".
            </h3>
        </div>
    ) :
        idsRegistros.map(idRegistro => {
            return <PNCFila
                        key={`PNC_${idRegistro}`}
                        idRegistro={parseInt(idRegistro)}
                        registro={registros[idRegistro]}
                        callbackModificar={handleBtnModificar}
                        callbackEliminar={handleBtnEliminar}
                   />
        });
    return (
        <div className="reporte__tabla">
            <table>
                <thead>
                    <tr>
                        <th colSpan={7}>{nombreReporte}</th>
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
        eliminaPNC
    } = registro;

    return (
        <tr>
            <td>{numeroPNC}</td>
            <td>{folio}</td>
            <td>{fechaRegistro}</td>
            <td>{especIncumplida}</td>
            <td>{accionImplantada}</td>
            <td>{ eliminaPNC["radio-si"] ? "X" : " " }</td>
            <td>{ eliminaPNC["radio-no"] ? "X" : " " }</td>
            <td>
                <button
                    onClick={(e) => {
                        // TODO: Llamar a una funcion que asigne los datos en
                        //       los estados de 'ReportesProductosNoConformes'
                        callbackModificar(idRegistro, registro);
                    }}
                >
                    Modificar
                </button>
            </td>
            <td>
                <button
                    onClick={(e) => {
                        // TODO: Llamar a una función que agregue el
                        //       parametro registro al estado
                        //      'registrosEliminados' de 
                        //      'ReportesProductosNoConformes'
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
            --> Objeto de arreglos. Almacena un arreglo que puede contener
                multiples objetos, estos representan el registro de reportes
                PNC que tiene el servidor.
                
                La estructura del objeto será la siguiente:
                
                {
                    <ID_REPORTE>:{<ID_REGISTRO>: {<REGISTROS>}} 
                        "ID_REPORTE": {
                            "ID_REGISTRO_1": {
                                "numeroPNC": numero,
                                "folio": string,
                                "fechaRegistro": string date ("yyyy-mm-dd"),
                                "especIncumplida": string,
                                "accionImplantada": string,
                                "eliminaPNC": { "radio-si": booleano. "radio-no": booleano. }
                            },
                            ...,
                            "ID_REGISTRO_n": {
                                ...
                            }
                        },

                        ...,

                        "NOMBRE_DEL_REPORTE_n" : {
                            ...
                        }
                }

        registrosAgregados:
            --> Objeto de arreglos. Almacena un arreglo que puede contener 
                multiples objetos, estos representan los registros de reportes
                que serán agregados en el registro del servidor. (es uno de los
                registro que se suben al momento de guardar).

                La estructura del objeto es igual a la de 'registroServidor'.

        registrosModificados:
            --> Objeto de arreglos. Almacena un arreglo que puede contener
                multiples objetos, estos representan los registros de reportes
                que serán modificados en el registro del servidor. (es uno de
                los registros que se suben al momento de guardar)

                La estructura del objeto es igual a la de 'registroServidor'.

        registrosEliminados:
            --> Objeto de arreglos. Almacena un arreglo que puede contener
                multiples objetos, estos representan los registros de reportes
                que serán eliminados en el registro del servidor. (es uno de
                los registros que se suben al momento de guardar).

                La estructura del objeto es igual a la de 'registroServidor'.

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
    const [registroServidor, setRegistroServidor] = useState({});
    const [registrosAgregados, setRegistroAgregados] = useState({});
    const [registrosModificados, setRegistrosModificados] = useState({});
    const [registrosEliminados, setRegistrosEliminados] = useState({});
    const [isDownloadable, setIsDownloadable] = useState(false);
    const [isAdding, setIsAdding] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showModal, setShowModal] = useState(false);
    /**
        Estados para registrar/modificar PNC:

        actualPNCID:
            --> Int. Contador de registros agregados, representa el último ID
                registrado.

        pncID:
            --> Int. Contador espejo de actualPNCID, pero este puede ser
                modificado para contener el ID de un PNC que va a ser
                modificado o eliminado. El valor que contenga va a ser igual
                al de 'actualPNCID' cuando se va a agregar un nuevo PNC.

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

        eliminaPNC:
            --> Objeto de booleanos. Almacena un objeto que contiene dos
                atributos booleanos, estos definen que input de tipo radio
                fue seleccionado por el usuario.
    **/
    const [actualPNCID, setActualPNCID] = useState(1);
    const [pncID, setPncId] = useState(1);
    const [noPNC, setNoPNC] = useState("");
    const [fechaRegistro, setFechaRegistro] = useState(new Date().toISOString().split('T')[0]);
    const [reporte, setReporte] = useState({});
    const [folio, setFolio] = useState("");
    const [especIncumplida, setEspecIncumplida] = useState("");
    const [accionImplantada, setAccionImplantada] = useState("");
    const [eliminaPNC, setEliminaPNC] = useState(checkStateRadioInput);

    const obtenerReportes = useCallback(() => {
        getAllReportes(auth.user.token).then(data => {
            setReportes(data)
        })
    }, [setReportes]);

    useEffect(obtenerReportes, [setReportes]);

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
    }

    function handleFormFieldset(event) {
        const {name, value} = event.target;

        let eliminaPNCAux = {};
        Object.keys(eliminaPNC).forEach(key => {
            eliminaPNCAux[key] = (key === name) ? true : false;
        });
        setEliminaPNC(eliminaPNCAux);
    }

    function updatingEstadosRegistro({
        newReporte = {},
        pncID = actualPNCID,
        numeroPNC = "",
        folio = "",
        fechaRegistro = new Date().toISOString().split('T')[0],
        especIncumplida = "",
        accionImplantada = "",
        eliminaPNC = {...checkStateRadioInput}
    } = {}) {
        console.log("UpdatingEstadosRegistro...");
        console.log(newReporte);
        setReporte(newReporte);
        // TODO: Revisar como se va a manejar la asignación de pncID
        setPncId(pncID);
        setNoPNC(numeroPNC);
        setFolio(folio);
        setFechaRegistro(fechaRegistro);
        setEspecIncumplida(especIncumplida);
        setAccionImplantada(accionImplantada);
        setEliminaPNC(eliminaPNC);
    }

    function modificarEstadosRegistro(nombreReporte, idRegistro, registro) {
        const {
            numeroPNC,
            folio,
            fechaRegistro,
            espInc,
            accionImp,
            eliminaPNC
        } = registro;
        const reporteAux = reportes.find(reporteObj => {
            return reporteObj['Nombre_Reporte'] === nombreReporte
        });
        console.log(reporteAux);

        updatingEstadosRegistro({newReporte: reporteAux, pncID: idRegistro, ...registro});
        // setPncId(idRegistro);
        // setNoPNC(numeroPNC);
        // setFechaRegistro(fechaRegistro);
        // setReporte(reporteAux);
        // setFolio(folio);
        // setEspecIncumplida(espInc);
        // setAccionImplantada(accionImp);
        // setEliminaPNC({...eliminaPNC});

        // Activa el componente Modal y activa la flag isUpdating
        setUpdatingModal(true);
    }

    function agregarRegistroEliminado(nombreReporte, idRegistro, registro) {
        // TODO: Al momento de agregar un elemento a 'registrosEliminados'
        //       se debe tener especial cuidado de revisar los estados de
        //       registros (registroServidor, registrosAgregados,
        //       registrosModificados).
    }

    const formulario = (
        <form>
            <div className="form__menu_reportes">
                <Menu
                    labelTxt="Reportes:"
                    selectId="menu-reportes"
                    selectName="lista-reportes"
                    selectFn={(event) => {
                        let value = event.target.value;
                        if (value !== "") {
                            let idReporte = parseInt(value);
                            const reporteAux = reportes.find(reporteObj => {
                                return reporteObj["ID_Reporte"] === idReporte;
                            });
                            setReporte(reporteAux);
                            if (isAdding) {
                                const registrosReporte = registrosAgregados[idReporte];
                                let numeroPNC = 1;
                                if (registrosReporte !== undefined) {
                                    numeroPNC = Object.keys(registrosReporte).length + 1;
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
                    />
                </label>
                <label>
                    <span>
                        Folio:
                    </span>
                    <input
                        type={"text"}
                        name={"input-pnc-folio"}
                        value={folio}
                        onChange={(e) => setFolio(e.target.value)}
                    />
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
                        checked={eliminaPNC["radio-si"]}
                        onChange={handleFormFieldset}
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
                        checked={eliminaPNC["radio-no"]}
                        onChange={handleFormFieldset}
                    />
                </div>
            </fieldset>
        </form>
    );

    const BloqueRegistros = () => {
        let contenido = (
            <div className="data__body__reportes_display">
                <h3>Todavía no hay ningún PNC registrado.</h3>
            </div>
        );
        // TODO: Hacer merge de los estados 'registrosAgregados' y
        //       'registroServidor', asegurar que no haya colisión de
        //       registros (repetición por modificación o por
        //       eliminación).
        const idsReportes = Object.keys(registrosAgregados);
        if (idsReportes !== undefined && idsReportes.length !== 0) {
            console.log(idsReportes);
            // TODO: Cambiar el nombreReporte por ID_Reporte y obtener el
            //       nombreReporte con Array.find();
            contenido = idsReportes.map((idReporte, idx) => {
                console.log(idReporte);
                const reporteAux = reportes.find(obj => obj.ID_Reporte === parseInt(idReporte));
                console.log(reporteAux);
                return <Reporte
                    key={`ReporteTabla__${idx}`}
                    nombreReporte={reporteAux.Nombre_Reporte}
                    registros={registrosAgregados[idReporte]}
                    callbackBtnModificar={modificarEstadosRegistro}
                    callbackBtnEliminar={agregarRegistroEliminado}
                />
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
                            // TODO: Hacer que detecte si un campo hizo falta
                            //       de llenar y agregue una etiqueta que haga
                            //       notar dicho campo.
                            //
                            // TODO: ¿Cómo saber si un PNC de un reporte X es
                            //       cambiado a ser de un reporte Y? Cambiar la
                            //       estructura de los estados o incorporar
                            //       alguna funcion que facilite el borrar
                            //       aquellos PNC modificados a otro reporte.
                            const idReporte = reporte["ID_Reporte"];
                            let registrosReporte = {};
                            let newPncID = actualPNCID;
                            let newPNC = {
                                    "numeroPNC": noPNC,
                                    "folio": folio,
                                    "fechaRegistro": fechaRegistro,
                                    "especIncumplida": especIncumplida,
                                    "accionImplantada": accionImplantada,
                                    "eliminaPNC": {...eliminaPNC}
                                };

                            if (isAdding) {
                                // El usuario esta agregando un PNC
                                registrosReporte = registrosAgregados[idReporte];
                                if (registrosReporte !== undefined) {
                                    // Si el registro del reporte no es undefined
                                    // quiere decir que existe algun PNC para dicho
                                    // reporte.
                                    setRegistroAgregados({
                                        ...registrosAgregados,
                                        [idReporte]: {
                                            ...registrosAgregados[idReporte],
                                            [pncID]: newPNC
                                        }
                                    });
                                } else {
                                    // Si el registro del reporte es undefined quiere
                                    // decir que no ha sido creado algun PNC para dicho
                                    // reporte
                                    setRegistroAgregados({
                                        [idReporte]: {
                                            [pncID]: newPNC
                                        }
                                    });
                                }
                                setActualPNCID(actualPNCID + 1);
                                // setPncId(pncID + 1);
                                newPncID = pncID + 1;
                            } else if (isUpdating) {
                                // El usuario esta modificando un PNC existente
                                registrosReporte = registrosModificados[idReporte];
                                if (registrosReporte !== undefined) {
                                    setRegistrosModificados({
                                        ...registrosModificados,
                                        [idReporte]: {
                                            ...registrosModificados[idReporte],
                                            [pncID]: newPNC
                                        }
                                    });
                                } else {
                                    setRegistrosModificados({
                                        [idReporte]: {
                                            [pncID]: newPNC
                                        }
                                    });
                                }
                                // setPncId(actualPNCID);
                                newPncID = actualPNCID;
                                setUpdatingModal(false);
                            }
                            updatingEstadosRegistro({pncID: newPncID});
                            // setNoPNC("");
                            // setFechaRegistro(new Date().toISOString().split('T')[0]);
                            // setReporte({});
                            // setFolio("");
                            // setEspecIncumplida("");
                            // setAccionImplantada("");
                            // setEliminaPNC({...checkStateRadioInput});

                            // Si el pncID es igual al actualPNCID quiere
                            // decir que se esta agregando un nuevo PNC a la lista
                            // (ya que pncID no puede estar modificando un PNC
                            // con un número mayor al del actualPNCID) por lo
                            // que ambos contadores se incrementan.
                            //
                            // En cambio, si resultan ser distintos, entonces
                            // quiere decir que se esta modificando un PNC, por lo
                            // tanto no se requiere incrementar el
                            // actualPNCID, en su lugar, el pncID debera
                            // adoptar de nueva cuenta el valor almacenado en
                            // actualPNCID.
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

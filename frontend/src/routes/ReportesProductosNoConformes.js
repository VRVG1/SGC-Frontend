import { useContext, useState, useEffect, useCallback } from "react";
import Menu from "../componentes/Menu";
import { AuthContext } from "./helpers/Auth/auth-context";
import getAllReportes from "./helpers/Reportes/getAllReportes";
import Modal from "./modal/Modal";


const checkStateRadioInput = {
    "radio-si": true,
    "radio-no": false
};

function Reporte({ nombreReporte, registros }) {
    const tableBody = registros.length === 0 ? (
        <h3>
            No se tiene ningún registro PNC registrado para el reporte
            "{nombreReporte}".
        </h3>
    ) :
        registros.map((registro, idx) => {
            return <PNCFila key={`PNC_${idx}`} registro={registro}/>
        });
    return (
        <div className="reporte__tabla">
            <table>
                <col className="reporte__tabla__empty_header"/>
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

function PNCFila({ registro }) {
    const {
        numeroPNC,
        folio,
        fechaRegistro,
        fechaRepoEntrega,
        especIncumplida,
        accionImplantada,
        eliminaPNC
    } = registro;

    // TODO: Agregar dos botones al final de cada fila; Uno para modificar y
    //       otro para eliminar.
    return (
        <tr>
            <td>{numeroPNC}</td>
            <td>{folio}</td>
            <td>{fechaRegistro}</td>
            <td>{especIncumplida}</td>
            <td>{accionImplantada}</td>
            <td>{ eliminaPNC["radio-si"] ? "X" : " " }</td>
            <td>{ eliminaPNC["radio-no"] ? "X" : " " }</td>
            <td><button>Modificar</button></td>
            <td><button>Eliminar</button></td>
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
            --> Objeto de arreglos. Almacena un objeto que puede contener
                multiples objetos, estos representan el registro de reportes
                PNC que tiene el servidor.
                
                La estructura del objeto será la siguiente:
                
                {
                    <NOMBRE_DEL_REPORTE>: <REGISTROS>
                        "NOMBRE_DEL_REPORTE_1": [
                            {
                                "numeroPNC": numero,
                                "folio": string,
                                "fechaRegistro": string date ("yyyy-mm-dd"),
                                "fechaRepoEntrega": string date ("yyyy-mm-dd"),
                                "especInc": string,
                                "accImp": string,
                                "eliminaPNC": {
                                    "radio-si": booleano.
                                    "radio-no": booleano.
                                }
                            },
                            ...,
                            {
                                ...
                            }
                        ],

                        ...,

                        "NOMBRE_DEL_REPORTE_n" : [
                            ...
                        ]
                }

        registroFrontend:
            --> Objeto de arreglos. Almacena un objeto que puede contener 
                multiples objetos, estos representan los registros de reportes
                que serán agregados en el registro del servidor. (es el
                registro que se sube al momento de guardar).

                La estructura del objeto será la siguiente:
                
                {
                    <NOMBRE_DEL_REPORTE>: <REGISTROS>
                        "NOMBRE_DEL_REPORTE_1": [
                            {
                                "numeroPNC": numero,
                                "folio": string,
                                "fechaRegistro": string date ("yyyy-mm-dd"),
                                "fechaRepoEntrega": string date ("yyyy-mm-dd"),
                                "especIncumplida": string,
                                "accionImplantada": string,
                                "eliminaPNC": {
                                    "radio-si": booleano.
                                    "radio-no": booleano.
                                }
                            },
                            ...,
                            {
                                ...
                            }
                        ],

                        ...,

                        "NOMBRE_DEL_REPORTE_n" : [
                            ...
                        ]
                }

        isDownloadable:
            --> Booleano. Cambia su valor cuando se obtiene el arreglo de
                          registroServidor, si el servidor retorna un arreglo
                          vacío este permanece en false, de lo contrario true.
        
        hasChanges:
            --> Booleano. Cambia su valor cuando se modifica un objeto dentro
                          de los registros (registroServidor, registroFrontend)
                          o cuando se agrega un nuevo objeto a
                          registroFrontend.

        showModal:
            --> Booleano. Cambia su valor cuando se presiona el boton de
                          agregar o modificar.
    **/
    const [reportes, setReportes] = useState([]);
    const [registroServidor, setRegistroServidor] = useState({});
    const [registroFrontend, setRegistroFrontend] = useState({});
    const [isDownloadable, setIsDownloadable] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showModal, setShowModal] = useState(false);
    /**
        Estados para registrar/modificar PNC:

        actualPNCCounter:
            --> Contador de registros agregados.

        pncCounter:
            --> Contador espejo de actualPNCCounter, pero este puede ser
                modificado para contener un contador pasado (de un objeto en
                algun registro).

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
    const [actualPNCCounter, setActualPNCCounter] = useState(1);
    const [pncCounter, setPNCCounter] = useState(1);
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

    function handleFormFieldset(event) {
        const {name, value} = event.target;

        let eliminaPNCAux = {};
        Object.keys(eliminaPNC).forEach(key => {
            eliminaPNCAux[key] = (key === name) ? true : false;
        });
        setEliminaPNC(eliminaPNCAux);
    }

    const formulario = (
        <form>
            <div className="form__menu_reportes">
                <Menu
                    labelTxt="Reportes:"
                    selectId="menu-reportes"
                    selectName="lista-reportes"
                    selectFn={(event) => {
                        let value = parseInt(event.target.value);
                        const reporteAux = reportes.find(reporteObj => {
                            return reporteObj["ID_Reporte"] === value;
                        })
                        setReporte(reporteAux);
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
                        value={pncCounter}
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
        let contenido = <h3>Todavía no hay ningún PNC registrado.</h3>;
        // TODO: Hacer merge de los estados 'registroFrontend' y
        //       'registroServidor', asegurar que no haya colisión de
        //       registros (repetición por modificación o por
        //       eliminación).
        if (Object.keys(registroFrontend).length !== 0) {
            console.log(Object.keys(registroFrontend));
            contenido = Object.keys(registroFrontend).map((nombreReporte, idx) => {
                console.log(nombreReporte);
                return <Reporte
                    key={`ReporteTabla__${idx}`}
                    nombreReporte={nombreReporte}
                    registros={registroFrontend[nombreReporte]}
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
                    setShowModal(true);
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
            setShow={setShowModal}
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

                            const nombre_reporte = reporte["Nombre_Reporte"];
                            let newPNC = {
                                "numeroPNC": pncCounter,
                                "folio": folio,
                                "fechaRegistro": fechaRegistro,
                                "fechaEntrega": reporte["Fecha_Entrega"],
                                "especIncumplida": especIncumplida,
                                "accionImplantada": accionImplantada,
                                "eliminaPNC": {...eliminaPNC}
                            };
                            // Si el pncCounter es igual al actualPNCCounter quiere
                            // decir que se esta agregando un nuevo PNC a la lista
                            // (ya que pncCounter no puede estar modificando un PNC
                            // con un número mayor al del actualPNCCounter) por lo
                            // que ambos contadores se incrementan.
                            //
                            // En cambio, si resultan ser distintos, entonces
                            // quiere decir que se esta modificando un PNC, por lo
                            // tanto no se requiere incrementar el
                            // actualPNCCounter, en su lugar, el pncCounter debera
                            // adoptar de nueva cuenta el valor almacenado en
                            // actualPNCCounter.
                            if (actualPNCCounter === pncCounter) {
                                if (Object.keys(registroFrontend).length !== 0) {
                                    if (registroFrontend[nombre_reporte] !== undefined) {
                                        setRegistroFrontend({
                                            ...registroFrontend,
                                            [nombre_reporte]: [
                                                ...registroFrontend[nombre_reporte],
                                                newPNC
                                            ]
                                        });
                                    } else {
                                        setRegistroFrontend({
                                            ...registroFrontend,
                                            [nombre_reporte]: [newPNC]
                                        })
                                    }
                                } else {
                                    setRegistroFrontend({
                                        [nombre_reporte]: [newPNC]
                                    });
                                }
                                setActualPNCCounter(actualPNCCounter + 1);

                                // Se deben resetear todos los estados que se
                                // modificaron con el nuevo PNC.
                                setPNCCounter(pncCounter + 1);
                                // TODO: Ver si puedo usar un useRef para
                                //       mantener el string de la fecha actual,
                                //       para no tener que llamar a esta
                                //       funcion.
                                setFechaRegistro(new Date().toISOString().split('T')[0]);
                                setReporte({});
                                setFolio("");
                                setEspecIncumplida("");
                                setAccionImplantada("");
                                setEliminaPNC(checkStateRadioInput);
                            } else {
                                setRegistroFrontend({
                                    ...registroFrontend,
                                    [nombre_reporte]: registroFrontend[nombre_reporte].map(objeto => {
                                        if (objeto["numeroPNC"] === newPNC["numeroPNC"]) {
                                            return newPNC;
                                        } else {
                                            return objeto;
                                        }
                                    })
                                });
                                setPNCCounter(actualPNCCounter);
                                // TODO: Ver si puedo usar un useRef para
                                //       mantener el string de la fecha actual,
                                //       para no tener que llamar a esta
                                //       funcion.
                                setFechaRegistro(new Date().toISOString().split('T')[0]);
                                setReporte({});
                                setFolio("");
                                setEspecIncumplida("");
                                setAccionImplantada("");
                                setEliminaPNC(checkStateRadioInput);
                            }
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

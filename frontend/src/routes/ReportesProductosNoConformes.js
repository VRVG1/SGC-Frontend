import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./helpers/Auth/auth-context";
import Modal from "./modal/Modal";

function PNCFila(
    {
        numeroPNC,
        folio,
        fechaRegistro,
        fechaRepoEntrega,
        especInc,
        accImp
    }
) {

    return (
        <div>
            <h3>
                Productos No Conformes en los Reportes de Gestión y Seguimiento
                del Curso ({fechaRepoEntrega})
            </h3>
        </div>
    );
}

export default function ReportesProductosNoConformes() {
    let auth = useContext(AuthContext);
    /**
        Estados-Contexto de ReportesProductosNoConformes:

        registroServidor:
            --> Un arreglo de objetos. Almacena el registro de reportes que
                tiene el servidor.

        registroFrontend:
            --> Un arreglo de objetos. Almacena los registros de reportes que
                serán agregados en el registro del servidor. (es el registro
                que se sube al momento de guardar).

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
    const [registroServidor, setRegistroServidor] = useState([]);
    const [registroFrontend, setRegistroFrontend] = useState([]);
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
    const [folio, setFolio] = useState("");
    const [especIncumplida, setEspecIncumplida] = useState("");
    const [accionImplantada, setAccionImplantada] = useState("");
    const [eliminaPNC, setEliminaPNC] = useState({
        "radio-si": false,
        "radio-no": false
    });

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
            <label>
                No.:
                <input
                    type={"number"}
                    name={"input-pnc-num"}
                    value={pncCounter}
                    disabled={true}
                />
            </label>
            <label>
                Folio:
                <input
                    type={"text"}
                    name={"input-pnc-folio"}
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                />
            </label>
            <label>
                Especificación Incumplida:
                <textarea
                    name={"input-pnc-especificacion-incumplida"}
                    value={especIncumplida}
                    onChange={(e) => setEspecIncumplida(e.target.value)}
                />
            </label>
            <label>
                Acción Implantada:
                <textarea
                    name={"input-pnc-accion-implantada"}
                    value={accionImplantada}
                    onChange={(e) => setAccionImplantada(e.target.value)}
                />
            </label>
            <fieldset>
                <legend>
                    Eliminar PNC
                </legend>
                <div>
                    <input
                        type={"radio"}
                        id={"rSi"}
                        name={"radio-si"}
                        value={"Si"}
                        checked={eliminaPNC["radio-si"]}
                        onChange={handleFormFieldset}
                    />
                    <label htmlFor={"rSi"}>
                        Si
                    </label>
                </div>
                <div>
                    <input
                        type={"radio"}
                        id={"rNo"}
                        name={"radio-no"}
                        value={"No"}
                        checked={eliminaPNC["radio-no"]}
                        onChange={handleFormFieldset}
                    />
                    <label htmlFor={"rNo"}>
                        No
                    </label>
                </div>
            </fieldset>
        </form>
    );

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
                    registroServidor.length === 0
                }
            >
                <span>Descargar</span>
            </button>
        </div>
    );

    return (
        <>
            <div className="data">
                <div className="data__header">
                    <h1>Productos No Conformes</h1>
                </div>
                <div className="data__body container">
                    <h2>Aquí va la lista de objetos PNCs</h2>
                    {botones}
                </div>
            </div>
            <Modal
                show={showModal}
                setShow={setShowModal}
                title={"Agregar PNC"}
            >
                {formulario}
                <button
                    onClick={() => {
                        let newPNC = {
                            "numeroPNC": pncCounter,
                            "folio": folio,
                            "fechaRegistro": fechaRegistro,
                            "especIncumplida": especIncumplida,
                            "accionImplantada": accionImplantada,
                            "eliminaPNC": eliminaPNC
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
                            setRegistroFrontend([
                                ...registroFrontend,
                                newPNC
                            ]);
                            setActualPNCCounter(actualPNCCounter + 1);
                            setPNCCounter(pncCounter + 1);
                        } else {
                            let registroFrontendAux = [];
                            registroFrontendAux = registroFrontend.map(pnc => {
                                return pnc["numeroPNC"] === newPNC["numeroPNC"] ? newPNC : pnc;
                            });
                            setRegistroFrontend(registroFrontendAux);
                            setPNCCounter(actualPNCCounter);
                        }
                    }}
                >
                    <span>Guardar</span>
                </button>
            </Modal>
        </>
    );
}

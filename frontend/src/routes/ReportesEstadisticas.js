import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './helpers/Auth/auth-context';
import getAllCarrera from "./helpers/Carreras/getAllCarrera";
import filtroEstadistico from "./helpers/Reportes/filtroEstadistica";
import { EstadisticaContext } from './helpers/Reportes/EstadisticaContext';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const tituloTipoDatos = "Mostrar datos de:";
const dataMenuMostrarPor = [
    {
        key: "reproKey",
        value: "reprobación",
        titulo: "Índice de Reprobación"
    },
    {
        key: "reporKey",
        value: "reportes",
        titulo: "Entrega de Reportes"
    },

];

function Option({value, txt}) {
    return (
        <option value={value}>
            {txt}
        </option>
    );
}

function Menu({
               labelTxt,
               selectId,
               selectName,
               selectFn,
               selectValue,
               defaultOptionTxt,
               optionsList,
               optKey,
               optValue,
               optTxt,
               hidden = true
              }) {
    return hidden ? "" : (
        <div>
            <label htmlFor={selectId}>
                { labelTxt }
            </label>
            <select
                name={ selectName }
                id={ selectId }
                onChange={ selectFn }
                value={ selectValue }
            >
                <option value="">{ defaultOptionTxt }</option>
                {
                    optionsList.length === 0 ? "" : optionsList.map(option => (
                        <Option
                            key={ option[optKey] }
                            value={ option[optValue] }
                            txt={ option[optTxt] } />
                ))}
            </select>
        </div>
    );
}

/**
    * React Component which represent the view of ReportesEstadisticas.
**/
export default function ReportesEstadisticas() {
    let auth = useContext(AuthContext);

    const [carreras, setCarreras] = useState([]);
    const [filterListData, setFilterListData] = useState([]);
    const [graphicDataList, setGraphicDataList] = useState([]);
    const [dataListIndex, setDataListIndex] = useState(0);
    /**
        mostrarPor:
            --> reprobación
            --> reportes

        filtrarPor:
            --> maestro
            --> materia
            --> grupo
            --> puntual
            --> inpuntual

        deLaCarrera:
            --> An object from carreras that was selected in the filter.

        datoFiltrado:
            --> The data selected which also is related to 
                "filtrarPor" + "deLaCarrera".
    **/
    const [mostrarPor, setMostrarPor] = useState("");
    const [filtrarPor, setFiltrarPor] = useState("");
    const [deLaCarrera, setDeLaCarrera] = useState({});
    const [datoFiltrado, setDatoFiltrado] = useState("");

    const value = { carreras, setCarreras,
                    filterListData, setFilterListData,
                    graphicDataList, setGraphicDataList,
                    dataListIndex, setDataListIndex,
                    mostrarPor, setMostrarPor,
                    filtrarPor, setFiltrarPor,
                    deLaCarrera, setDeLaCarrera,
                    datoFiltrado, setDatoFiltrado
                  };

    const obtenerCarrera = useCallback(() => {
        getAllCarrera(auth.user.token).then((data) => {
            setCarreras(data)
        })
    }, [setCarreras]);

    useEffect(obtenerCarrera, [setCarreras]);

    return (
        <EstadisticaContext.Provider value = { value }>
            <div className="data">
                <div className="data__header">
                    <h1>Estadísticas</h1>
                </div>
                <div className="data__filters container">
                    <h2>Área de Filtros</h2>
                    <form>
                        <Filtros/>
                    </form>
                </div>
                <div className="data__graphics container">
                    <div className="data__graphics__header">
                        <h2>Área de Gráficos</h2>
                    </div>
                    <div className='data__graphics__info'>
                        <Grafico />
                    </div>
                </div>
            </div>
        </EstadisticaContext.Provider>
    );
}

/**
    * React Component that contains the filters area of
    * ReportesEstadisticas.
]*/
function Filtros() {
    const auth = useContext(AuthContext);
    const estatContext = useContext(EstadisticaContext);

    let method = estatContext.mostrarPor === 'reprobación' ? estatContext.filtrarPor : 'reporte'
    const tituloFilteredData = `${method === "materia" ? "una": "un"} ${method}`;

    const [checkedRadio, setCheckedRadio] = useState({
        "radio-maestro": false,
        "radio-materia": false,
        "radio-grupo": false,
        "radio-puntual": false,
        "radio-inpuntual": false,
    });

    function handleMenuMostrarPor(e) {
        // Set the mostrarPor state var
        estatContext.setMostrarPor(e.target.value);
        // Also, as mostrarPor is the base for the other states, when it
        // changes all the states has to be erase to his defaults
        if (Object.keys(estatContext.deLaCarrera).length !== 0) {
            estatContext.setDeLaCarrera({});
        }
        if (estatContext.filtrarPor !== "") {
            estatContext.setFiltrarPor("");
        }

        let aux = Object.assign({}, checkedRadio);
        let count = 0;
        Object.keys(aux).forEach(key => {
            if (aux[key]) {
                aux[key] = false;
                count++;
            }
        });

        if (count > 0) {
            setCheckedRadio(aux);
        }

        if (estatContext.filterListData.length !== 0) {
            estatContext.setFilterListData([]);
            estatContext.setDatoFiltrado("");
            estatContext.setGraphicDataList([]);
            estatContext.setDataListIndex(0);
        }
    }

    /**
        * handleCareerList is a function that handle the event
        * 'OnChange' trigger by the career's <Menu /> element.
        **/
    function handleCareerList(e) {
        let id_carrera = e.target.value;
        if (id_carrera !== "") {
            let carrera = estatContext.carreras.find(c => c.ID_Carrera == id_carrera);
            estatContext.setDeLaCarrera(carrera);

            let filtro = estatContext.mostrarPor === "reprobación" ?
                estatContext.filtrarPor : "reportes";

            // Once the deLaCarrera state is assigned, the datoFiltrado list
            // of options has to be filled.
            filtroEstadistico(
                auth.user.token,
                carrera["Nombre_Carrera"],
                filtro
            ).then(res => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            }).then((obj) => {
                if (estatContext.filtrarPor === "grupo") {
                    let grupos = obj.map((arreglo, idx) => ({
                        key: `${arreglo[0]}${idx}`,
                        value: arreglo[0]
                    }));
                    estatContext.setFilterListData(grupos);
                } else {
                    estatContext.setFilterListData(obj);
                }
                // estatContext.setFilterListData(obj.data());
            }).catch((error) => {
                console.log(error.message);
            });
        } else {
            estatContext.setDeLaCarrera({});
            estatContext.setFilterListData([]);
            estatContext.setDatoFiltrado("");
            estatContext.setGraphicDataList([]);
            estatContext.setDataListIndex(0);
        }
    }

    /**
        * handleFilterDataList is a function that handle the event
        * 'OnChange' trigger by the FilterDataList <Menu /> element.
        **/
    function handleFilterDataList(e) {
        let selectedOption = e.target.value;
        if (selectedOption !== "") {
            estatContext.setDatoFiltrado(selectedOption);

            let dato = "";
            let filtro = "";
            if (estatContext.mostrarPor === "reprobación") {
                if (estatContext.filtrarPor === "maestro") {
                    // dato: "Nombre_Usuario-Nombre_Carrera"
                    dato = `${selectedOption}-${estatContext.deLaCarrera["Nombre_Carrera"]}`;
                    filtro = "IndMaestro";
                } else if (estatContext.filtrarPor === "materia") {
                    // dato: "Clave_reticula-Nombre_Carrera"
                    dato = `${selectedOption}-${estatContext.deLaCarrera["Nombre_Carrera"]}`;
                    filtro = "IndMateria";
                } else if (estatContext.filtrarPor === "grupo") {
                    // dato: "Grupo-Nombre_Carrera"
                    dato = `${selectedOption}-${estatContext.deLaCarrera["Nombre_Carrera"]}`;
                    filtro = "IndGrupo";
                } else if (estatContext.filtrarPor === "puntual") {
                    // dato: "Nombre_Usuario-Nombre_Carrera"
                    dato = `${selectedOption}-${estatContext.deLaCarrera["Nombre_Carrera"]}`;
                    filtro = "NoEntregaPuntual";
                } else if (estatContext.filtrarPor === "inpuntual") {
                    // dato: "Nombre_Usuario-Nombre_Carrera"
                    dato = `${selectedOption}-${estatContext.deLaCarrera["Nombre_Carrera"]}`;
                    filtro = "NoEntregaInpuntual";
                }
            } else if (estatContext.mostrarPor === "reportes") {
                dato = `Nombre_Reporte=${selectedOption}&Nombre_Carrera=${estatContext.deLaCarrera["Nombre_Carrera"]}`;
                filtro = "IndEntregaReportes";
            }
            filtroEstadistico(
                auth.user.token,
                dato,
                filtro
            ).then(res => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            }).then(obj => {
                estatContext.setGraphicDataList(obj);
                estatContext.setDataListIndex(0);
            }).catch(error => {
                console.log(error.message);
            })
        } else {
            estatContext.setDatoFiltrado("");
        }
    }

    function handleFilterMethod(e) {
        const {name, value} = e.target;

        let checkedRadioAux = {};
        Object.keys(checkedRadio).forEach(key => {
            checkedRadioAux[key] = (key === name) ? true : false;
        });
        setCheckedRadio(checkedRadioAux);

        estatContext.setFiltrarPor(value);
        // bloqueMetodoFiltro define the values of "deLaCarrera" and
        // "datoFiltrado" menus. So, when it changes those states has to be
        // erase to defaults.
        if (Object.keys(estatContext.deLaCarrera).length !== 0) {
            estatContext.setDeLaCarrera({});
        }
        if (estatContext.filterListData.length !== 0) {
            estatContext.setFilterListData([]);
            estatContext.setDatoFiltrado("");
        }
    }


    function getOptKey() {
        let key = "";
        if (estatContext.mostrarPor === "reprobación") {
            if(estatContext.filtrarPor === "maestro") {
                key = "PK";
            } else if (estatContext.filtrarPor === "materia") {
                key = "Clave_reticula";
            } else if (estatContext.filtrarPor === "grupo") {
                key = "key";
            }
        } else if (estatContext.mostrarPor === "reportes") {
            key = "ID_Reporte";
        }
        return key;
    }

    function getOptValue() {
        let value = "";
        if (estatContext.mostrarPor === "reprobación") {
            if(estatContext.filtrarPor === "maestro") {
                value = "Nombre_Usuario";
            } else if (estatContext.filtrarPor === "materia") {
                value = "Nombre_Materia";
            } else if (estatContext.filtrarPor === "grupo") {
                value = "value";
            }
        } else if (estatContext.mostrarPor === "reportes"){
            value = "Nombre_Reporte";
        }
        return value;

    }

    function getOptTxt() {
        let txt = "";
        if (estatContext.mostrarPor === "reprobación") {
            if(estatContext.filtrarPor === "maestro") {
                txt = "Nombre_Usuario";
            } else if (estatContext.filtrarPor === "materia") {
                txt = "Nombre_Materia";
            } else if (estatContext.filtrarPor === "grupo") {
                txt = "value";
            }
        } else if (estatContext.mostrarPor === "reportes") {
            txt = "Nombre_Reporte";
        }
        return txt;
    }

    const menusData = {
        mostrarPor: {
            labelTxt: tituloTipoDatos,
            selectId: "tipo-datos",
            selectName: "tipo-dato",
            selectFn: handleMenuMostrarPor,
            selectValue: estatContext.mostrarPor,
            defaultOptionTxt: "--Elija una opción--",
            optionsList: dataMenuMostrarPor,
            optKey: "key",
            optValue: "value",
            optTxt: "titulo",
            hidden: false
        },
        carreras: {
            labelTxt: "Seleccione una carrera",
            selectId: "career-list",
            selectName: "lista-carreras",
            selectFn: handleCareerList,
            selectValue: Object.keys(estatContext.deLaCarrera).length !== 0 ? estatContext.deLaCarrera['ID_Carrera'] : "",
            defaultOptionTxt: "--Elija una carrera--",
            optionsList: estatContext.carreras,
            optKey: "ID_Carrera",
            optValue: "ID_Carrera",
            optTxt: "Nombre_Carrera",
            hidden: false
        },
        opcionesFiltrado: {
            labelTxt: `Seleccione ${tituloFilteredData}`,
            selectId: "data-list",
            selectName: "filter-data",
            selectFn: handleFilterDataList,
            selectValue: estatContext.datoFiltrado,
            defaultOptionTxt: `--Elija ${tituloFilteredData}--`,
            optionsList: estatContext.filterListData,
            optKey: getOptKey(),
            optValue: getOptValue(),
            optTxt: getOptTxt(),
            hidden: Object.keys(estatContext.deLaCarrera).length === 0 && estatContext.datoFiltrado === ""
        }
    };

    const filtros = {
        "reprobación": {
            "maestro": {
                "id": "rMaestro",
                "name": "radio-maestro",
                "value": "maestro",
                "titulo": "Maestro"
            },
            "materia": {
                "id": "rMateria",
                "name": "radio-materia",
                "value": "materia",
                "titulo": "Materia"
            },
            "grupo": {
                "id": "rGrupo",
                "name": "radio-grupo",
                "value": "grupo",
                "titulo": "Grupo"
            },
        },
        "reportes": {
            "puntual": {
                "id": "rPuntual",
                "name": "radio-puntual",
                "value": "puntual",
                "titulo": "Entrega Puntual"
            },
            "inpuntual": {
                "id": "rInpuntual",
                "name": "radio-inpuntual",
                "value": "inpuntual",
                "titulo": "Entrega Inpuntual"
            },
        }
    };

    /**
        * React Component that represent the filter/selection of data
        * that is going to be displayed with graphics.
    **/
    let filtroDatos = "";
    if (estatContext.filtrarPor !== "" ||
        estatContext.mostrarPor === "reportes") {
        filtroDatos = (
            <>
            { /** menuCarreras **/ }
                <Menu
                    labelTxt={menusData.carreras.labelTxt}
                    selectId={menusData.carreras.selectId}
                    selectName={menusData.carreras.selectName}
                    selectFn={menusData.carreras.selectFn}
                    selectValue={menusData.carreras.selectValue}
                    defaultOptionTxt={menusData.carreras.defaultOptionTxt}
                    optionsList={menusData.carreras.optionsList}
                    optKey={menusData.carreras.optKey}
                    optValue={menusData.carreras.optValue}
                    optTxt={menusData.carreras.optTxt}
                    hidden={menusData.carreras.hidden}
                />
            { /** menuOpcionesFiltrado **/ }
                <Menu
                    labelTxt={menusData.opcionesFiltrado.labelTxt}
                    selectId={menusData.opcionesFiltrado.selectId}
                    selectName={menusData.opcionesFiltrado.selectName}
                    selectFn={menusData.opcionesFiltrado.selectFn}
                    selectValue={menusData.opcionesFiltrado.selectValue}
                    defaultOptionTxt={menusData.opcionesFiltrado.defaultOptionTxt}
                    optionsList={menusData.opcionesFiltrado.optionsList}
                    optKey={menusData.opcionesFiltrado.optKey}
                    optValue={menusData.opcionesFiltrado.optValue}
                    optTxt={menusData.opcionesFiltrado.optTxt}
                    hidden={menusData.opcionesFiltrado.hidden}
                />
            </>
        );
    }

    // Add in a list every JSX element (radio button) related with the
    // data type selected in <select>
    let bloqueMetodoFiltro = estatContext.mostrarPor === "reprobación" &&
        Object.keys(filtros[estatContext.mostrarPor]).map(filtro => {
            let id = filtros[estatContext.mostrarPor][filtro].id;
            let name = filtros[estatContext.mostrarPor][filtro].name;
            let value = filtros[estatContext.mostrarPor][filtro].value;
            let titulo = filtros[estatContext.mostrarPor][filtro].titulo;
            return (
                <div key={value}>
                    <input
                        type="radio"
                        id={id}
                        name={name}
                        value={value}
                        checked={checkedRadio[name]}
                        onChange={handleFilterMethod}
                    />
                    <label htmlFor={id}>
                        {titulo}
                    </label>
                </div>
            );
        });

    const radioBtnBlock = estatContext.mostrarPor !== "reprobación" ? "" : (
        <div>
            <fieldset>
                <legend>
                    Filtrar por:
                </legend>
                {bloqueMetodoFiltro}
            </fieldset>
        </div>
    ); 

    // TODO: Ajustar los fetch en 'filtroEstadistico' para que tomen los datos
    //       correctos para las graficas en mostrarPor -> 'reportes'
    //       en especial los de 'handleFilterDataList' y los de
    //       'handleCareerList'
    return (
        <>
            <Menu
                labelTxt={menusData.mostrarPor.labelTxt}
                selectId={menusData.mostrarPor.selectId}
                selectName={menusData.mostrarPor.selectName}
                selectFn={menusData.mostrarPor.selectFn}
                selectValue={menusData.mostrarPor.selectValue}
                defaultOptionTxt={menusData.mostrarPor.defaultOptionTxt}
                optionsList={menusData.mostrarPor.optionsList}
                optKey={menusData.mostrarPor.optKey}
                optValue={menusData.mostrarPor.optValue}
                optTxt={menusData.mostrarPor.optTxt}
                hidden={menusData.mostrarPor.hidden}
            />
            {radioBtnBlock}
            {filtroDatos}
        </>
    );
}

function Grafico() {
    const auth = useContext(AuthContext);
    const estatContext = useContext(EstadisticaContext);
    let bloqueGrafico = (
        <>
            <h3>Todavía no ha seleccionado los filtros necesarios.</h3>
        </>
    );

    if (estatContext.datoFiltrado !== "" && estatContext.graphicDataList.length !== 0) {
        const bloqueBotones = (
            <div className='data__graphics__buttons'>
                <button
                    onClick={() => {
                            estatContext.setDataListIndex(estatContext.dataListIndex - 1)
                    }}
                    disabled={ estatContext.dataListIndex === 0 }
                >
                    <span>{"<"}</span>
                </button>
                <div>
                    <span>{estatContext.dataListIndex + 1}</span>
                    <span>/</span>
                    <span>{estatContext.graphicDataList.length}</span>
                </div>
                <button
                    onClick={() => {
                            estatContext.setDataListIndex(estatContext.dataListIndex + 1)
                    }}
                    disabled={ estatContext.dataListIndex == estatContext.graphicDataList.length - 1 }
                >
                    <span>{">"}</span>
                </button>
            </div>
        );
        let bloqueInfo = "";

        if (estatContext.mostrarPor === "reprobación") {
            const data = {
                labels: ['Reprobados', 'Aprobados'],
                datasets: [
                    {
                        label: 'Porcentaje',
                        data: [
                            estatContext.graphicDataList[estatContext.dataListIndex].reprobados,
                            estatContext.graphicDataList[estatContext.dataListIndex].aprobados
                        ],
                        backgroundColor: [
                            'rgba(173, 0, 0, 0.2)',
                            'rgba(0, 173, 87, 0.2)'
                        ],
                        borderColor: [
                            'rgba(173, 0, 0, 1)',
                            'rgba(0, 173, 87, 1)'
                        ],
                        borderWidth: 1,
                    },
                ],
            };
            bloqueInfo = (
                <>
                    <div className='data__graphics__filtered--pie-canvas'>
                        <div className='data__graphics__filtered--pie-canvas__canvas'>
                            <Pie
                            data={data}
                            options={{
                                maintainAspectRatio: false
                            }}
                            />
                        </div>
                        <div className='data__graphics__filtered__info'>
                            <div>
                                <strong>Profesor: </strong>
                                <span>{estatContext.graphicDataList[estatContext.dataListIndex].Nombre_Usuario}</span>
                            </div>
                            <div>
                                <strong>Carrera: </strong>
                                <span>{estatContext.graphicDataList[estatContext.dataListIndex].Nombre_Carrera}</span>
                            </div>
                            <div>
                                <strong>Semestre: </strong>
                                <span>{estatContext.graphicDataList[estatContext.dataListIndex].Semestre}</span>
                            </div>
                            <div>
                                <strong>Grupo: </strong>
                                <span>{estatContext.graphicDataList[estatContext.dataListIndex].Grupo}</span>
                            </div>
                            <div>
                                <strong>Nombre Materia: </strong>
                                <span>{estatContext.graphicDataList[estatContext.dataListIndex].Nombre_Materia}</span>
                            </div>
                            <div>
                                <strong>Unidad: </strong>
                                <span>{estatContext.graphicDataList[estatContext.dataListIndex].Unidad}</span>
                            </div>
                        </div>
                    </div>
                    {bloqueBotones}
                </>
            );
        } else if (estatContext.mostrarPor === "reportes") {
            const data = {
                labels: ['Puntual', 'Inpuntual'],
                datasets: [
                    {
                        // label: 'No. Reportes',
                        data: [
                            3, 5
                            // estatContext.graphicDataList["Count_Puntuales"],
                            // estatContext.graphicDataList["Count_Inpuntuales"]
                        ],
                        backgroundColor: [
                            'rgba(0, 173, 87, 0.2)',
                            'rgba(173, 0, 0, 0.2)',
                        ],
                        borderColor: [
                            'rgba(0, 173, 87, 1)',
                            'rgba(173, 0, 0, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };
            bloqueInfo = (
                <>
                    <div className='data__graphics__filtered--bar-canvas'>
                        <div className='data__graphics__filtered--bar-canvas__canvas'>
                            <Bar
                            data={data}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: false
                                }
                            }}
                            />
                        </div>
                        <div className='data__graphics__filtered__info'>
                            <div>
                                <strong>Carrera: </strong>
                                <span>{estatContext.graphicDataList["Nombre_Carrera"]}</span>
                            </div>
                            <div>
                                <strong>Reporte: </strong>
                                <span>{estatContext.graphicDataList["Nombre_Reporte"]}</span>
                            </div>
                            <div>
                                <strong>Limite de Entrega: </strong>
                                <span>{estatContext.graphicDataList["Nombre_Reporte"]}</span>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        bloqueGrafico = (
            <>
                {bloqueInfo}
            </>
        );
    } else if (estatContext.datoFiltrado !== "" && estatContext.graphicDataList.length === 0) {
        bloqueGrafico = (
            <>
                <h3>Al parecer, no hay información relacionada con "{estatContext.datoFiltrado}"</h3>
            </>
        );
    }

    return (bloqueGrafico);
}

// export default ReportesEstadisticas;

import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './helpers/Auth/auth-context';
import getAllCarrera from "./helpers/Carreras/getAllCarrera"

const tituloTipoDatos = "Mostrar datos de:";
const tipoDatosData = {
    "reprobacion": {
        "value": "reprobacion",
        "titulo": "Indice de Reprobación"
    },
    "reportes": {
        "value": "reportes",
        "titulo": "Entrega de Reportes"
    }
};


/**
    * React Component which represent the view of ReportesEstadisticas.
**/
const ReportesEstadisticas = () => {
    let auth = useContext(AuthContext);

    const [carreras, setCarreras] = useState([]);
    const [filterListData, setFilterListData] = useState([]);

    const obtenerCarrera = useCallback(() => {
        getAllCarrera(auth.user.token).then((data) => {
            setCarreras(data)
        })
    }, [setCarreras]);

    useEffect(obtenerCarrera, [setCarreras]);

    /**
        * React Component that contains the filters area of
        * ReportesEstadisticas.
    ]*/
    function Filtros() {
        /**
            tipoDato:
                --> reprobacion
                --> reportes

            filterMethod:
                --> maestro
                --> materia
                --> grupo
                --> puntual
                --> inpuntual

            filterCareer:
                --> An object from carreras that was selected in the filter.

            filterData:
                --> The data selected which also is related to 
                    "filterMethod" + "filterCareer".
        **/
        const [tipoDato, setTipoDato] = useState("");
        const [filterMethod, setFilterMethod] = useState("");
        const [filterCareer, setFilterCareer] = useState({});
        const [filterData, setFilterData] = useState("");
        const [checkedRadio, setCheckedRadio] = useState({
            "radio-maestro": false,
            "radio-materia": false,
            "radio-grupo": false,
            "radio-puntual": false,
            "radio-inpuntual": false,
        });
        console.log(filterCareer);

        /**
            * React Component that represent the filter/selection of data
            * that is going to be displayed with graphics.
            **/
        function FiltroDatos() {

            let method = tipoDato === 'reprobacion' ? filterMethod : 'maestro'
            const tituloFilteredData = `${method === "materia" ? "una": "un"} ${method}`;
            console.log(tituloFilteredData);

            /**
                * handleListChange is a function that handle the event
                * 'OnChange' trigger by the career's select tag.
                **/
            function handleCareerList(e) {
                let id_carrera = e.target.value;
                if (id_carrera !== "") {
                    let carrera = carreras.find(c => c.ID_Carrera == id_carrera);
                    setFilterCareer(carrera);
                    console.log(carrera);
                } else {
                    setFilterCareer({});
                }
            }

            function handleFilterDataList(e) {
                // TODO: Get the object related to e.target.value
                console.log(e.target.value);
            }

            let elementListCarreras = (
                <div>
                    <label htmlFor="career-list">
                        Seleccione una carrera:
                    </label>
                    <select
                        name="lista-carreras"
                        id="career-list"
                        onChange={handleCareerList}
                        value={Object.keys(filterCareer).length !== 0 ? filterCareer['ID_Carrera'] : ""}
                    >
                        <option value="">--Elija una carrera--</option>
                        {carreras.length === 0 ? "" : carreras.map(carrera => (
                            <option
                                key={carrera.ID_Carrera}
                                value={carrera.ID_Carrera}
                            >
                                {carrera.Nombre_Carrera}
                            </option>))}
                    </select>
                </div>
            );

            let elementListMethodData = (
                Object.keys(filterCareer).length === 0 && filterData === ""
            ) ? "" : (
                <div>
                    <label  htmlFor="data-list">
                        Seleccione {tituloFilteredData}
                    </label>
                    <select
                        name="filter-data"
                        id="data-list"
                        onChange={e => handleFilterDataList(e)}
                    >
                        <option value="">--Elija {tituloFilteredData}--</option>
                        {/*TODO: Inject the array mapping here */}
                    </select>
                </div>
            );

            return filterMethod == "" ? "" : (
                <>
                    {elementListCarreras}
                    {elementListMethodData}
                </>
            );
        }

        function MetodoFiltrado() {
            const filtros = {
                "reprobacion": {
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

            if (tipoDato === "") return <></>;

            function handleFilterMethod(e) {
                const {name, value} = e.target;

                let checkedRadioAux = {};
                Object.keys(checkedRadio).forEach(key => {
                    checkedRadioAux[key] = (key === name) ? true : false;
                });
                setCheckedRadio(checkedRadioAux);

                setFilterMethod(value);
            }
            // Add in a list every JSX element (radio button) related with the
            // data type selected in <select>
            let bloqueMetodoFiltro = Object.keys(
                    filtros[tipoDato]
                ).map(filtro => {
                    let id = filtros[tipoDato][filtro].id;
                    let name = filtros[tipoDato][filtro].name;
                    let value = filtros[tipoDato][filtro].value;
                    let titulo = filtros[tipoDato][filtro].titulo;
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

            return (
                <>
                    <div>
                        <fieldset>
                            <legend>
                                Filtrar por:
                            </legend>
                            {bloqueMetodoFiltro}
                        </fieldset>
                    </div>
                    <FiltroDatos/>
                </>
            );
        }

        function handleTipoDatoList(e) {
            // Set the tipoDato state var
            setTipoDato(e.target.value);
            // Also, as tipoDato is the base for the other states, when it
            // changes all the states has to be erase to his defaults
            if (Object.keys(filterCareer).length !== 0) {
                setFilterCareer({});
            }
            if (filterMethod !== "") {
                setFilterMethod("");
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
        }


        let listaSeleccionFiltrado = (
            <div>
                <label htmlFor="tipo-datos">
                    {tituloTipoDatos}
                </label>
                <select
                    name="tipo-dato"
                    id="tipo-datos"
                    onChange={handleTipoDatoList}
                    >
                    <option value="">--Elija una opcion--</option>
                    <option value={tipoDatosData.reprobacion.value}>
                        {tipoDatosData.reprobacion.titulo}
                    </option>
                    <option value={tipoDatosData.reportes.value}>
                        {tipoDatosData.reportes.titulo}
                    </option>
                </select>
            </div>
        );

        return (
            <>
                {listaSeleccionFiltrado}
                <MetodoFiltrado/>
            </>
        );
    }

    return (
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
                <h2>Área de Gráficos</h2>
                {/** TODO: Crear un componente que agregue los graficos **/}
            </div>
        </div>
    )
}

export default ReportesEstadisticas;

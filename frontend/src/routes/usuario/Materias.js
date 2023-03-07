import React, { useState, useEffect, useContext } from 'react'

import { AuthContext } from "../helpers/Auth/auth-context.js";
import getAllUnidadesDocente from '../helpers/Unidades/getAllUnidadesDocente.js';
import getInfoUser from '../helpers/Usuarios/getInfoUser'

const Materias = () => {
    let auth = useContext(AuthContext);

    const [infoUser, setinfoUser] = useState([])
    const [materiaD, setmateriaD] = useState([])
    const [unidadesD, setunidadesD] = useState([])

    useEffect(() => {
        const getInforUser = async () => {
            await getInfoUser(auth.user.token).then((data) => {
                setinfoUser({
                    ...infoUser,
                    username: data.username,
                    CorreoE: data.CorreoE,
                    Nombre_Usuario: data.Nombre_Usuario,
                    PK: data.PK,
                })
            }
            ).catch((err) => {
                //console.log(err);
            }
            );
        }
        getInforUser();
        return () => {
        }
    }, []);

    useEffect(() => {
        const getAllUnidadesDocentes = async (PK) => {
            await getAllUnidadesDocente(auth.user.token, PK).then((data) => {
                let uni = 0
                let cont = 0
                let arrayAux = []
                data.map((materia) => {
                    if (materia.Unidades !== undefined) {
                        let auxSi = {
                            Nombre_Materia: materia.Nombre_Materia,
                            Semestre: materia.Semestre,
                            Grupo: materia.Grupo,
                            Aula: materia.Aula,
                            Unidades: materia.Unidades,
                        }
                        uni = materia.Unidades
                        setmateriaD(materiaD => [...materiaD, auxSi])
                    } else {
                        let aux = {}
                        if (materia.Reprobados === -1) {
                            aux = {
                                Fecha_Entrega: "",
                                ID_Generacion: materia.ID_Generacion,
                                Reprobados: "",
                                Unidad: materia.Unidad
                            }
                        } else {
                            aux = {
                                Fecha_Entrega: materia.Fecha_Entrega,
                                ID_Generacion: materia.ID_Generacion,
                                Reprobados: materia.Reprobados,
                                Unidad: materia.Unidad
                            }
                        }
                        cont += 1
                        arrayAux.push(aux)
                        if (cont === uni) {
                            setunidadesD(unidadesD => [...unidadesD, arrayAux])
                            arrayAux = []
                            cont = 0
                        }
                    }
                })
            }).catch((err) => {
                console.log(err);
            })
        }
        if (infoUser.length === undefined) {
            getAllUnidadesDocentes(infoUser.PK)
        }
        return () => {

        }
    }, [infoUser])


    function unidades(index) {
        unidadesD.map((datos) => {
            return (
                <div className='materia-flex-right'>
                    <div className='materia-unidad-card'>
                        <div className='card-title'>
                            <p>Unidad {datos.Unidad}</p>
                        </div>
                        <div className='card-body'>
                            <div className='fecha'>
                                <p> {datos.Fecha_Entrega} </p>
                            </div>
                            <div className='reprobados'>
                                <p>Indice de reprobados:
                                    <input
                                        value={datos.Reprobados}></input>
                                </p>
                            </div>
                        </div>
                        <div className='card-footer'>
                            <button> Guardar </button>
                        </div>
                    </div>
                </div>
            );
        })
    }


    function materias() {

        return (
            <div className='Materia-container'>
                <div className='materia-flex'>
                    <div className='materia-flex-left'>
                        <div className='materia-title'>
                            <p>Programacion orientada a abjetos</p>
                        </div>
                        <div className='materia-detalles'>
                            <p>2</p>
                            <p>A</p>
                            <p>j20</p>
                        </div>
                    </div>
                    <div className="scroll">
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            {true ?
                <>
                    {Object.keys(materiaD).length !== 0 ?
                        (
                            materiaD.map((datos, index) => {
                                return (
                                    <div className='Materia-container'>
                                        <div className='materia-flex'>
                                            <div className='materia-flex-left'>
                                                <div className='materia-title'>
                                                    <p>{datos.Nombre_Materia}</p>
                                                </div>
                                                <div className='materia-detalles'>
                                                    <p>{datos.Semestre}</p>
                                                    <p>{datos.Grupo}</p>
                                                    <p>{datos.Aula}</p>
                                                </div>
                                            </div>
                                            <div className="scroll">
                                                {Object.keys(unidadesD).length !== 0 ?
                                                    (
                                                        unidadesD[index] !== undefined ? 
                                                        (
                                                            unidadesD[index].map((datos) => {
                                                                return (
                                                                    <div className='materia-flex-right'>
                                                                        <div className='materia-unidad-card'>
                                                                            <div className='card-title'>
                                                                                <p>Unidad {datos.Unidad}</p>
                                                                            </div>
                                                                            <div className='card-body'>
                                                                                <div className='fecha'>
                                                                                    <p> {datos.Fecha_Entrega} </p>
                                                                                </div>
                                                                                <div className='reprobados'>
                                                                                    <p>Indice de reprobados:
                                                                                        <input
                                                                                            value={datos.Reprobados}></input>
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className='card-footer'>
                                                                                <button> Guardar </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        ) 
                                                        : 
                                                        (<></>)
                                                    )
                                                    :
                                                    (<></>)}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })

                        )
                        :
                        (<></>)}
                </>
                :
                <></>
            }
        </>
    )
}

export default Materias;
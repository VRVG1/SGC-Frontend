import React, { useState, useEffect, useContext } from 'react'

import { AuthContext } from "./helpers/Auth/auth-context.js";

const ReportesMaterias = () => {

    function unidades(num) {
        return (
            <div className='rmateria-flex-right'>
                <div className='rmateria-unidad-card'>
                    <div className='rcard-title'>
                        <p>Unidad {num}</p>
                    </div>
                    <div className='rcard-body'>
                        <div className='rfecha'>
                            <p> 27/03/2023 </p>
                        </div>
                        <div className='rreprobados'>
                            <p>Indice de reprobados: {"20%"}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function maestros() {
        return (
            <div className='rMaterias-Maestros'>
                <h1>Nombre del Maestro</h1>
                {[...Array(10)].map((e, i) => (
                    <div className='rmateria-flex'>
                        <div className='rmateria-flex-left'>
                            <div className='rmateria-title'>
                                <p>Programacion orientada a Objetos</p>
                            </div>
                            <div className='rmateria-detalles'>
                                <p>2</p>
                                <p>A</p>
                                <p>j20</p>
                            </div>
                        </div>
                        <div className="rscroll">
                            {unidades(1)}
                            {unidades(2)}
                            {unidades(3)}
                            {unidades(4)}
                            {unidades(5)}
                            {unidades(6)}
                            {unidades(7)}
                            {unidades(8)}
                        </div>
                    </div>
                ))}

            </div>
        )
    }


    return (
        <>
            {true ?
                <>
                    <div className='rMateria-container'>
                        <div className='rContainer-buscar'>
                            <h1>Reportes Materias</h1>
                            <form>
                                <div className="rmateria">
                                    <input
                                        type="text"
                                        id="Materia-name"
                                        name="Materia_reticula"
                                        className="inputMaterias"
                                        required
                                    />
                                    <span className="highlight Materias"></span>
                                    <span className="bottomBar Materias"></span>
                                    <label className="Materias">Reticula de la Materia</label>
                                </div>
                            </form>
                        </div>
                        {maestros()}
                        {maestros()}
                    </div>
                </>
                :
                <></>
            }
        </>
    )
}

export default ReportesMaterias;
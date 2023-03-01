import React, { useState, useEffect, useContext } from 'react'

import { AuthContext } from "../helpers/Auth/auth-context.js";

const Materias = () => {

    function unidades(num) {
        return (
            <div className='materia-flex-right'>
                <div className='materia-unidad-card'>
                    <div className='card-title'>
                        <p>Unidad {num}</p>
                    </div>
                    <div className='card-body'>
                        <div className='fecha'>
                            <p> 27/03/2023 </p>
                        </div>
                        <div className='reprobados'>
                            <p>Indice de reprobados:
                                <input></input>
                            </p>
                        </div>
                    </div>
                    <div className='card-footer'>
                        <button> Guardar </button>
                    </div>
                </div>
            </div>
        );
    }


    function materias() {
        return (
            <div className='Materia-container'>
                {[...Array(10)].map((e, i) => (
                    <div className='materia-flex'>
                        <div className='materia-flex-left'>
                            <div className='materia-title'>
                                <p>Programacion orientada a Objetos</p>
                            </div>
                            <div className='materia-detalles'>
                                <p>2</p>
                                <p>A</p>
                                <p>j20</p>
                            </div>
                        </div>
                        <div className="scroll">
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
                    {materias()}
                </>
                :
                <></>
            }
        </>
    )
}

export default Materias;
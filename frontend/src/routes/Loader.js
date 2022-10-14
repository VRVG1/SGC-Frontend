import React from 'react'

/**
 * Componente dialgo de cargando
 * @param {*} props 
 * @returns 
 */
export const Loader = (props) => {
    return (
        <div className='loader'>
            <div className='loader__contenedor'>
                <p className='label'>Cargando...</p>
                <div className='animation'>
                    <div className='circle'></div>
                    <div className='circle'></div>
                    <div className='circle'></div>
                </div>
            </div>
        </div>
    )
}



export default Loader;
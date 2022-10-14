import React, { useState, useEffect, useContext } from 'react'
import Loader from './Loader';
import { AuthContext } from './helpers/Auth/auth-context'
import getDataSheet from './helpers/Exportar/getDataSheet'

/**
 *  Componente de exportar datos.
 * @param {*} props 
 * @returns componente
 */
const ExportData = props => {
  let auth = useContext(AuthContext);
  const [loading, setLodaing] = useState(false);
  /**
   * Metodo/funcion que hace el llamado para exportar datos y espera para
   * posteriormente descargar el archivo generado.
   */
  const getDataSheetFile = () => {
    //Poner aqui el exportar datos ya sea del backend o del front end xd
    setLodaing(true);
    getDataSheet(auth.user.token);
  }

  useEffect(() => {
      var idTimeout = 0;
      idTimeout = setTimeout(() => {
          setLodaing(false)
      }, 2000);

      return () => {
          clearTimeout(idTimeout);
      }
  }, [loading])


  return (
      <>
          {loading === false ? (
              <div className='conteiner-exportdata'>
                  <h1 className='conteiner-exportdata__tile'>
                    Exportar Informacion en una hoja de calculo
                  </h1>
                  <form>
                    <input
                        className='conteiner-exportdata__button'
                        type="button"
                        value={"Exportar"}
                        onClick={getDataSheetFile}
                    />
                  </form>
              </div>

          ) : (
              <Loader />
          )}
      </>
  )
}

export default ExportData;

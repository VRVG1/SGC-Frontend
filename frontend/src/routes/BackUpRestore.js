import React, { useState, useEffect, useRef, useContext } from 'react'
import Loader from './Loader';
import getBackup from './helpers/RespaldoYRestauracion/getBackup'
import makeRestore from './helpers/RespaldoYRestauracion/postRestore'
import { AuthContext } from './helpers/Auth/auth-context'


/**
 *  Componente para crear respaldo y restaurar base de datos
 * @param {*} props 
 * @returns Componente 
 */
const BackUpRestore = props => {
  let auth = useContext(AuthContext);
  const [loading, setLodaing] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState({});

  const useForceUpdate = () => useState()[1];
  const fileInput = useRef(null);
  const forceUpdate = useForceUpdate();

  function RestoreStatus(props) {
    let messageContainer;
    if (Object.entries(restoreMessage).length !== 0) {
      let messageStyle;
      if (restoreMessage.isOperationSuccess) {
        messageStyle = 'success';
      } else {
        messageStyle = 'primero-error';
      }
      messageContainer = (
        <div className={messageStyle}>
          <p>{ restoreMessage.message }</p>
        </div>
      );
    } else {
      messageContainer = (<div></div>);
    }

    return messageContainer;
  }

  function fileNames() {
    const { current } = fileInput;

    if (current && current.files.length > 0) {
      console.log(current.files);
      let messages = [];
      let cont = 0;
      for (let file of current.files) {
        console.log(cont)
        messages = messages.concat(
          <div className='archivo'>
            <p className='archivoP' key={cont}>{file.name}</p>
          </div>
        );
        cont++;
      }
      return messages;
    }
    return null;
  }

  /**
  * Funcion encargada de llamar al servidor para que le envíe un archivo
  * comprimido con todos los datos de respaldo del servidor SGC.
  *
  * **/
  function getBackupFile() {
    setLodaing(true);
    getBackup(auth.user.token);
  }

  function restoreSubmitHandler(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    makeRestore(auth.user.token, formData, (responseMsg) => {
      setRestoreMessage(responseMsg);
    });
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
        <div className='conteiner-BUR'>
          <div className='conteiner-BUR__BU'>
            <h1>Respaldar</h1>
            <form>
              <input
                type={'button'}
                value="BackUp"
                className='Espacios'
                onClick={getBackupFile}
              />
            </form>
          </div>

          <div className='conteiner-BUR__R'>
            <h1 >Restaurar</h1>
            <RestoreStatus />
            <form
              className='conteiner-BUR_R__form'
              onSubmit={restoreSubmitHandler}
            >
              <div className="file-upload">
                <p className='subidor__p'>Soltar archivo(s)</p>
                <div className='subidor'>
                  <input
                    id="file"
                    type="file"
                    ref={fileInput}
                    onChange={forceUpdate}
                    className="file-upload__input"
                    name="restorefile"
                    accept='.zip'
                    required
                  />
                </div>
              </div>
              <div className='fileNames-container'>
                {fileNames()}
              </div>
              <input type="submit"
                value={"Restaurar"}
                className='Espacios'
              />
            </form>
          </div>
        </div>
      ) : (
        <Loader />
      )}

    </>
  )
}


export default BackUpRestore

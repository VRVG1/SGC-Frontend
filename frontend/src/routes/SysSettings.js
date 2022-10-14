import React, { useState, useContext } from 'react'
import Modal from './modal/Modal.js';
import borrarSemestre from './helpers/Mensajeria/borrarSemestre.js';

import { AuthContext } from "./helpers/Auth/auth-context.js";
const SysSettings = () => {
  let auth = useContext(AuthContext);

  const [modal, setModal] = useState(false);
  const [showModalConfirmacion, setShowModalConfirmacion] = useState(false);
  const [mensajes, setMensajes] = useState({
    titulo: '',
    cuerpo: '',
  });
  return (
    <div className='containerMaterias'>
      <h1>Ajustes del sistema</h1>
      <button onClick={() => {
        setModal(true);
      }}>Iniciar nuevo semestre</button>
      <Modal show={modal} setShow={setModal} title={"Advertencia"}>
        <p>¿Esta seguro que desea iniciar un nuevo semestre?</p>
        <div className='botonesBorrarSYS'>
          <button onClick={() => {
            borrarSemestre(auth.user.token).then(res => {
              if (res === "OK") {
                setModal(false);
                setMensajes({
                  ...mensajes,
                  titulo: 'Eliminado',
                  cuerpo: 'Se ha iniciado un nuevo semestre',
                });
                setShowModalConfirmacion(true);
              } else {
                setModal(false);
                setMensajes({
                  ...mensajes,
                  titulo: 'Error',
                  cuerpo: 'No se pudo iniciar un nuevo semestre',
                });
                setShowModalConfirmacion(true);
              }
            });
          }}>Si</button>
          <button onClick={() => {
            setModal(false);
          }}>No</button>

        </div>
      </Modal>
      <Modal show={showModalConfirmacion} setShow={setShowModalConfirmacion} title={mensajes.titulo}>
        <p>{mensajes.cuerpo}</p>
      </Modal>
    </div>
  )
}

export default SysSettings
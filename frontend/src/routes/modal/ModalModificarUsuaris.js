import React, { useState } from "react";
import Modal from './Modal.js'
const ModalModificarUsuaris = props => {
    const [showModal, setShowModal] = useState(false)
    const [showModalConfirm, setShowModalConfirm] = useState(false)

    function updateUser() {
        setShowModalConfirm(false)
        props.callback(false)
    }

    return (
        <>
            {/* Modal modificacion */}

            <Modal show={props.show} setShow={props.setShow} title={"Modificar Usuario"}>
                <form>
                    <div className="form group modal Usuario">
                        <input
                            type="text"
                            id="usuario-name"
                            name="usuario-name"
                            className="inputUsuarios"
                            required
                        />
                        <span className="highlight Usuarios"></span>
                        <span className="bottomBar Usuarios"></span>
                        <label className="Usuarios">Nombre de Usuario</label>
                    </div>

                    <div className="form group modal Usuario">
                        <select>
                            <option value="Maestro">Maestro</option>
                            <option value="Administrados">Administrados</option>
                            <option value="Supervisor">Supervisor</option>
                        </select>
                        <span className="highlight Usuarios"></span>
                        <span className="bottomBar Usuarios"></span>
                        <label className="Usuarios">Tipo de Usuario</label>
                        {/* <span className="highlight Usuario"></span>
            <span className="bottomBar Usuario"></span>
            <label>Tipo de Usuario</label>  */}
                    </div>

                    <div className="form group modal Usuario">
                        <input
                            type="text"
                            id="usuario-nickname"
                            name="usuario-nickname"
                            className="inputUsuarios"
                            required
                        />
                        <span className="highlight Usuarios"></span>
                        <span className="bottomBar Usuarios"></span>
                        <label className="Usuarios">Apodo de Usuario</label>
                    </div>

                    <div className="form group modal Usuario">
                        <input
                            type="email"
                            id="usuario-email"
                            name="usuario-email"
                            pattern=".+@cdguzman.tecnm.com"
                            title="Correo electronico Institucional del ITCG"
                            className="inputUsuarios"
                            required
                        />
                        <span className="highlight Usuarios"></span>
                        <span className="bottomBar Usuarios"></span>
                        <label className="Usuarios">Correo de Usuario</label>
                    </div>

                    <div className="form group modal Usuario">
                        <input
                            type="password"
                            id="usuario-password"
                            name="usuario-password"
                            className="inputUsuarios"
                            required
                        />
                        <span className="highlight Usuarios"></span>
                        <span className="bottomBar Usuarios"></span>
                        <label className="Usuarios">Contrasena de Usuario</label>
                    </div>
                </form>

                <input
                    type="submit"
                    className="button Usuarios"
                    value="Cerrar"
                    className="button Usuarios"
                    onClick={() => props.callback(false)}
                />

                <input
                    type="submit"
                    className="button Usuarios"
                    value="Guardar"
                    className="button Usuarios"
                    onClick={() => setShowModalConfirm(true)}
                />

            </Modal>

            <Modal show={showModalConfirm} setShow={setShowModalConfirm} title={"Modificar"}>
                <div className="modal group">
                    <p>Realmente quiere modificar a: {"Nombre maestro"}</p>
                </div>
                <input
                    type="submit"
                    className="button Usuarios"
                    value="Cancelar"
                    className="button Usuarios"
                    onClick={() => setShowModalConfirm(false)}
                />
                <input
                    type="submit"
                    className="button Usuarios delete"
                    value="Confirmar"
                    className="button Usuarios"
                    onClick={() => updateUser()}
                />
            </Modal>
        </>
    );
}

export default ModalModificarUsuaris
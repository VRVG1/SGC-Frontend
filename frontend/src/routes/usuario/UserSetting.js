import React, { useState, useEffect, useContext } from 'react'

import { AuthContext } from "../helpers/Auth/auth-context.js";
import getInfoUser from '../helpers/Usuarios/getInfoUser'
import putDocente from '../helpers/Usuarios/putDocente.js';
import Loader from '../Loader.js';
import Modal from '../modal/Modal.js';
const UserSettings = () => {
    let auth = useContext(AuthContext);
    const [dataInput, setdataInput] = useState({
        password: '',
        password2: '',
        username: '',
        CorreoE: '',
        Nombre_Usuario: '',
        PK: '',
    });
    const [regex, setRegex] = useState({
        username: /^[a-zA-Z\d@~._-]{0,20}$/,
        password: /.{0,20}/,
        password2: /.{0,20}/,
        CorreoE: /.*/,
        Nombre_Usuario: /^[A-Za-z\sÀ-ÿ]{0,100}$/,
    })
    const [infoUser, setInfoUser] = useState([])
    const [loading, setLoading] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showModalError, setShowModalError] = useState(false);
    const [showmodalAlert, setShowmodalAlert] = useState(false);

    /**
   * Recibe los datos escritos en un input
   * @param {*} event 
   */
    const handleInputOnChange = (event) => {
        if (event.target.value.match(regex[event.target.name]) != null) {
            setdataInput({
                ...dataInput,
                [event.target.name]: event.target.value
            });
        }
    }

    const putUserData = async () => {
        if (dataInput.password === dataInput.password2) {
            setLoading(true);
            let result = await putDocente(dataInput, auth.user.token);
            if (result === "Accepted") {
                console.log("actualizado")
                setLoading(false);
                setShowModalConfirm(true);
            } else {
                setLoading(false);
                setShowModalError(true);
            }
                
        } else {
            setShowmodalAlert(true);
        }
    }

    useEffect(() => {
        const getInforUser = async () => {
            await getInfoUser(auth.user.token).then((data) => {
                setdataInput({
                    ...dataInput,
                    username: data.username,
                    CorreoE: data.CorreoE,
                    Nombre_Usuario: data.Nombre_Usuario,
                    PK: data.PK,
                })
                console.log(data)
            }
            ).catch((err) => {
                console.log(err);
            }
            );
        }
        getInforUser();
        return () => {
            setInfoUser([]);
        }
    }, [])

    return (
        <>
            {!loading ?
                <>
                    <div className='containerUserSettings'>
                        <h1>Ajustes de Usuarios</h1>
                        <form>
                            <div className="form group modal Usuario">
                                <input
                                    type="text"
                                    id="usuario-name"
                                    name="Nombre_Usuario"
                                    className="inputUsuarioSettings"
                                    value={dataInput.Nombre_Usuario}
                                    onChange={handleInputOnChange}
                                    required
                                />
                                <span className="highlight UsuarioSettings"></span>
                                <span className="bottomBar UsuarioSettings"></span>
                                <label className="UsuarioSettings">Nombre de Usuario</label>
                            </div>
                            <div className="form group modal Usuario">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="inputUsuarioSettings"
                                    value={dataInput.username}
                                    onChange={handleInputOnChange}
                                    required
                                />
                                <span className="highlight UsuarioSettings"></span>
                                <span className="bottomBar UsuarioSettings"></span>
                                <label className="UsuarioSettings">Apodo</label>
                            </div>

                            <div className="form group modal Usuario">
                                <input
                                    type="text"
                                    id="CorreoE"
                                    name="CorreoE"
                                    className="inputUsuarioSettings"
                                    value={dataInput.CorreoE}
                                    onChange={handleInputOnChange}
                                    required
                                />
                                <span className="highlight UsuarioSettings"></span>
                                <span className="bottomBar UsuarioSettings"></span>
                                <label className="UsuarioSettings">Correo</label>
                            </div>

                            <div className="form group modal Usuario">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="inputUsuarioSettings"
                                    onChange={handleInputOnChange}
                                    value={dataInput.password}
                                    required
                                />
                                <span className="highlight UsuarioSettings"></span>
                                <span className="bottomBar UsuarioSettings"></span>
                                <label className="UsuarioSettings">Nueva contraseña</label>
                            </div>

                            <div className="form group modal Usuario">
                                <input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    className="inputUsuarioSettings"
                                    onChange={handleInputOnChange}
                                    value={dataInput.password2}
                                    required
                                />
                                <span className="highlight UsuarioSettings"></span>
                                <span className="bottomBar UsuarioSettings"></span>
                                <label className="UsuarioSettings">Confirmar contraseña</label>
                            </div>
                        </form>
                            <button onClick={putUserData}>Guardar</button>

                        <Modal show={showModalConfirm} setShow={setShowModalConfirm} title={"Datos Modificados"}>
                            <div className="modal group">
                                <p><strong>Los datos se han actualizado con exito</strong></p>
                            </div>
                            <button onClick={() => setShowModalConfirm(false)}>Confirmar</button>
                        </Modal>

                        <Modal show={showmodalAlert} setShow={setShowmodalAlert} title={"Alerta"}>
                            <div className="modal group">
                                <p><strong>Las contraseñas no coinciden</strong></p>
                            </div>
                            <button onClick={() => setShowmodalAlert(false)}>Confirmar</button>
                        </Modal>
                        
                        <Modal show={showModalError} setShow={setShowModalError} title={"ERROR"}>
                            <div className="modal group">
                                <p><strong>A ocurido un error con al intentar actualizar los datos <br /> Intente mas tarde</strong></p>
                            </div>
                            <button onClick={() => setShowModalError(false)}>Confirmar</button>
                        </Modal>
                    </div>
                </> :
                <>
                    <Loader />
                </>}
        </>

    )
}

export default UserSettings;
import React, { useContext, useEffect, useState } from "react";
import getInfoUser from './helpers/Usuarios/getInfoUser'
import { AuthContext } from "./helpers/Auth/auth-context.js";


const Home = () => {

  let auth = useContext(AuthContext);
  let date = new Date();
  let hour = date.getHours();

  const [infoUser, setInfoUser] = useState([]);

  useEffect(() => {
    const getInforUser = async () => {
      await getInfoUser(auth.user.token).then((data) => {
        setInfoUser(data);
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
  }, [auth.user.token]);

  /**
   * Metodo para conseguir la fecha y mandar el saludo
   * @returns {JSX}
   */
  const Saludo = () => {
    let saludo;
    if (hour >= 6 && hour < 12) {
      saludo = (
        <>
          <h1>Buenos días {infoUser.Nombre_Usuario}</h1>
        </>
      )
    }
    else if (hour >= 12 && hour < 18) {
      saludo = (
        <>
          <h1>Buenas tardes {infoUser.Nombre_Usuario}</h1>
        </>
      )
    }
    else {
      saludo = (
        <>
          <h1>Buenas noches {infoUser.Nombre_Usuario}</h1>
        </>
      )
    }
    return saludo;
  }
  return (
    <div className='usuario-container-parent'>
      <div className='usuario-container'>

        <Saludo />
        <h1>Bienvenido al Sistema Gestor del Curso</h1>
      </div>
    </div>
  );
}

export default Home;
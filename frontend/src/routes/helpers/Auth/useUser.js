import { useState } from 'react';

export default function useUser() {
  /**
    * Funcion encargada de obtener desde el localStorage el objeto contenedor
    * de los datos relacionados con la sesión del usuario.
    *
    * @returns Un objeto con dos atributos: token y permission, o, en caso de
    * no existir ningun inicio de sesión, retorna null.
    */
  const getUser = () => {
    const tokenString = localStorage.getItem('userSession');
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const [user, setUser] = useState(getUser());

  /** Funcion encargada de asignar un objeto al localStorage del navegador.
    *
    * @param {obj} userToken \n
    * Un objeto que deberá contener dos atributos: token y permission.
    */
  const saveUser = (userToken) => {
    localStorage.setItem('userSession', JSON.stringify(userToken));
    setUser(userToken);
  };

  const delUser = () => {
    localStorage.removeItem('userSession');
    setUser(null);
  }

  return {
    delUser: delUser,
    setUser: saveUser,
    user
  };
}

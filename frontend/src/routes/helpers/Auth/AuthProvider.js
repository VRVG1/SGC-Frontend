import useUser from './useUser';
import { BackendAuthProvider } from './BackendAuth';
import { AuthContext } from './auth-context'
/**
  * El componente <AuthProvider>{ children }</AuthProvider> se encarga de
  * cargar y mantener la información de inicio de sesión cargada para toda la
  * aplicación de frontend.
  *
  * @param {*} props
  * @returns React.Context.Provider
  */
export default function AuthProvider(props) {
  const { user, setUser, delUser } = useUser();

  /**
    * Funcion que encapsula la estructura para ejecutar el llamado de inicio de
    * sesión.
    * @param {FormData:obj} formData \n
    * Objeto de la interfaz FormData cuyo contenido debe ser el formulario de
    * inicio de sesión.
    * @param {function:obj} callback \n
    * Referencia a una función cuya ejecución se realizará si los datos en el
    * parametro 'formData' coinciden con los de un usuario existente.
    * @param {funcion:obj} failureCallback \n
    * Referencia a una función cuya ejecución se realizará si los datos
    * no coinciden con un usuario existente o surge algun error en el envío de
    * los datos.
    */
  let signin = (formData, callback, failureCallback) => {
    // NOTE: Lo ideal seria agregar un errorCallback, para que en caso de
    // existir una falla dentro del loggeo se retorne un mensaje para que el
    // componente Login lo muestre.
    return BackendAuthProvider.signin(formData, (returnedUserData) => {
      setUser(returnedUserData);
      callback();
    }, failureCallback);
  }

  /**
    * Funcion que encapsula la estructura para ejecutar el llamado de cierre de
    * sesión.
    * @param {function:obj} callback \n
    * Referencia a una función cuya ejecución se realizará una vez se hayan
    * cerrado sesión.
    */
  let signout = () => {
    return BackendAuthProvider.signout(() => {
      delUser();
      // Si se quiere agregar un callback a esta función, asegurarse de
      // crear una funcion especial en BarrNav
      //callback();
    })
  }

  let value = { user, signin, signout };

  return (
    <AuthContext.Provider value={ value }>
      { props.children }
    </AuthContext.Provider>);
}

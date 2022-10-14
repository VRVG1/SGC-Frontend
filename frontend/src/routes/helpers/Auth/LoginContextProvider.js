import { useState } from 'react';
import { LoginContext } from './login-context'

/**
  * El componente <LoginContextProvider>{ children }<LoginContextProvider> se
  * encarga de cargar y mantener la información relacionada con errores de
  * inicio de sesión, este componente unicamente esta presente dentro del
  * end-point '/login'.
  *
  * @param {*} props
  * @returns React.Context.Provider
  */
export default function LoginContextProvider(props) {
  const basisStatus = {
    failureStatus: false,
    error: undefined,
  };
  let [ status, setStatus ] = useState(basisStatus);

  let value = { status, setStatus };

  return (
    <LoginContext.Provider value={ value }>
      { props.children }
    </LoginContext.Provider>
  )
}


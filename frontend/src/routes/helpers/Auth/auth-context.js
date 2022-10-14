import React from 'react';

//export const userData = {
//  user: {
//    token: undefined,
//    permission: undefined,
//  },
//  signin: undefined,
//  signout: undefined,
//};

/**
  * AuthContext es un componente React.Context que facilita la herencia de
  * datos de autenticación y permisos entre los hijos del proveedor de este
  * mismo componente.
  */
export const AuthContext = React.createContext(null);

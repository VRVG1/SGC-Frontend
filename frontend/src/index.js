// X  TODO: Revisar la API de React.createContext.
// X  TODO: Realizar la conexión con el proveedor (backend).
// X  TODO: Juntar los tutoriales de digitalocean y react-router
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import './index.css';
//import App from './App';
import BarrNav from "./routes/BarrNav";
import Login from "./routes/login.js";
import Home from "./routes/Home";
import Usuarios from "./routes/Usuarios"
import Materias from "./routes/Materias"
import ReportesAdmin from "./routes/ReportesAdmin"
import NotMatch from "./routes/NotFound";
import ReportesCheck from "./routes/ReportesCheck";
import Carreras from "./routes/Carreras";
import ExportData from "./routes/ExportData";
import BackUpRestore from "./routes/BackUpRestore";
import Home2 from './routes/usuario/home';
import BarNav from './routes/usuario/BarNav'
import SysSettings from './routes/SysSettings';
import AuthProvider from './routes/helpers/Auth/AuthProvider';
import LoginContextProvider from './routes/helpers/Auth/LoginContextProvider';
import { AuthContext } from './routes/helpers/Auth/auth-context';
import { LoginContext } from './routes/helpers/Auth/login-context';
import OlvideContra from './routes/OlivdeContra';
import { Reportes } from './routes/usuario/Reportes';
import UserSettings from './routes/usuario/UserSetting';
import BarNavS from "./routes/Supervisor/BarNavS.js";

import "./styles/style.css";
import "./styles/BarrNav.css"
import "./styles/Usuarios.scss"
import "./styles/Materias.scss"
import "./styles/ReportesAdmin.scss"
import "./styles/ERROR.scss"
import "./styles/ReportesCheck.scss"
import "./styles/ExportData.scss"
import "./styles/BackUpRestore.scss"
import "./styles/usuario/home.scss"
import "./styles/Home.scss"
import "./styles/usuario/reportesU.scss"
import "./styles/usuario/UserSetting.scss"
import "./styles/sysSettings.scss"

/**
  * Funcion que facilita el acceso al contexto 'AuthContext'.
  *
  * @returns Componente React.Context
  */
export function useAuth() {
  return React.useContext(AuthContext);
}

/**
  * Función que facilita el acceso al context 'LoginContext'.
  *
  * @returns Componente React.Context
  */
function useLoginContext() {
  return React.useContext(LoginContext);
}

/**
  *
  * El componente <RequireAuth>{ children }</RequireAuth> verifica si el
  * navegador cuenta con las credenciales necesarias para acceder a los
  * componentes hijos de este.
  * En caso de no contar con estos permisos, redirige al navegador al end-point
  * "/login" para que inicie sesión.
  *
  * @param {*} props
  * @returns props.children \n
  * Los componentes dentro de este mismo componente.
  */
function RequireAuth(props) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return props.children;
}

/**
  * El componente <RequirePermission>{ children }</RequirePermission> verifica
  * el tipo de permiso con el que cuenta el navegador. En caso de contar con
  * el permiso requerido se encargará de cargar a los componentes suscritos
  * a este mismo, en caso contrario, redirige al end-point "/" para redirigir
  * al usuario a un sitio que acepte el tipo de permiso con el que cuenta.
  *
  * @param {*} props
  * @returns props.children \n
  * Los componentes dentro de este mismo componente (suscritos).
  */
function RequirePermission(props) {
  let auth = useAuth();
  let location = useLocation();

  if (!(auth.user.permission === props.userType)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return props.children;
}

/**
  *
  * El componente <LoginPage /> brinda el componente <Login /> en conjunto de
  * un manejador de ingreso de datos.
  *
  * @returns Componente <Login />
  */
function LoginPage(props) {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();
  let loginContext = useLoginContext();

  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    auth.signin(formData, () => {
      navigate(from, { replace: true });
    }, (error) => {
      if (!(loginContext.status?.failureStatus)) {
        loginContext.setStatus({
          failureStatus: true,
          error,
        });
      }
    });
  }

  if (auth.user?.token) {
    return <UserRedirector />;
  }

  return (<Login submitHandler={handleSubmit} />);

}

/**
  * El componente <UserRedirector /> facilita la redirección a la pagina de
  * inicio segun sea la sesión del usuario, en caso de no existir una sesión
  * activa esta pagina redirigira al usuario hacia el end-point "/login".
  *
  * @returns react-router.Navigate Component
  */
function UserRedirector() {
  let auth = useAuth();
  let to = "/login";

  if (!auth.user?.token) {
    to = "/login";
  } else {
    if (auth.user.permission === "Administrador") {
      to = "/admin/home";
    } else if (auth.user.permission === "Docente") {
      to = "/usuario/home";
    } else {
      to = "/supervisor/home";
    }
  }

  return <Navigate to={to} replace={true} />;

}

/**
  *
  * El componente <Application /> determina las rutas y la ejecución
  * de la aplicación.
  * 
  */
function Application() {
  return (
    <AuthProvider>
      <Routes>
        <Route>
          <Route path="/" element={<UserRedirector />} />
          <Route
            path="/login"
            element={
              <LoginContextProvider>
                <LoginPage />
              </LoginContextProvider>
            } />
          <Route path='/recuperacion' element={<OlvideContra />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <RequirePermission userType={"Administrador"}>
                  <BarrNav />
                </RequirePermission>
              </RequireAuth>
            }
          >
            {/** Poner aquí las rutas para el usuario de tipo administrador **/}
            <Route path="home" element={<Home />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="materias" element={<Materias />} />
            <Route path="carreras" element={<Carreras />} />
            <Route path="reportes/admin" element={<ReportesAdmin />} />
            <Route path="reportes/check" element={<ReportesCheck />} />
            <Route path="exportardatos" element={<ExportData />} />
            <Route path="Respaldoyrestauraciones" element={<BackUpRestore />} />
            <Route path='ajustes' element={<SysSettings />} />
          </Route>
          <Route
            path="/usuario"
            element={
              <RequireAuth>
                <RequirePermission userType={"Docente"}>
                  <BarNav />
                </RequirePermission>
              </RequireAuth>
            }>
            {/** Poner aquí las rutas para el usuario de tipo docente **/}
            <Route path='home' element={<Home2 />} />
            <Route path='reportes' element={<Reportes />} />
            <Route path='ajustes' element={<UserSettings />} />
          </Route>
          <Route
            path="/supervisor"
            element={
              <RequireAuth>
                <RequirePermission userType={"Supervisor"}>
                  <BarNavS />
                </RequirePermission>
              </RequireAuth>
            }>
            <Route path="home" element={<Home />} />
            <Route path="reportes/check" element={<ReportesCheck />} />
            <Route path="exportardatos" element={<ExportData />} />
            {/** Poner aquí las rutas para el usuario de tipo espectador **/}
          </Route>
          {/**

        Pasar las nuevas rutas al arbol de arriba

        <Route path='/' element={<Navigate to={'login'} />} >
        </Route>
        <Route path='login' element={<Login />} />
        <Route path="recuperar" element={<OlvideContra />} />
        <Route path="admin" element={<BarrNav />}>
          <Route path="home" element={<Home />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="materias" element={<Materias />} />
          <Route path="carreras" element={<Carreras />} />
          <Route path="reportes/admin" element={<ReportesAdmin />} />
          <Route path="reportes/check" element={<ReportesCheck />} />
          <Route path="exportardatos" element={<ExportData />} />
          <Route path="Respadoyrestauraciones" element={<BackUpRestore />} />
          <Route path='ajustes' element={<SysSettings />} />
        </Route>
        <Route path='usuario' element={<BarNav />}>
          <Route path=':usuario/home' element={<Home2 />}/>
          <Route path=':usuario/reportes' element={<Reportes />}/> 
        **/}
        </Route>
        <Route path="*" element={<NotMatch />} />
      </Routes>
    </AuthProvider>
  );
}

/**
  *
  * Componente principal de ejecución.
  *   Simplemente llama a los componentes basicos de la aplicación.   
  */
function Main() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Application />
      </BrowserRouter>
      <Outlet />
    </React.StrictMode>
  );
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);


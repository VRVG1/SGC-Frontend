import React, { Component } from 'react';
import { Outlet, Link } from "react-router-dom";
import { AuthContext } from '../helpers/Auth/auth-context';

export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            collapsed: false,
            username: '',
            email: '',
        };

        this.showingMenu = this.showingMenu.bind(this);
        this.responseHandler = this.responseHandler.bind(this);
    }
    toggleMenu = (event) => {
        let sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("close");
        let icon = document.querySelector(".bx-menu");
        icon.classList.toggle("close");
        //this.setState({
        //    collapsed: !this.state.collapsed,
        //})
    }

    changeRotulo = (rotulo) => {
        this.setState({
            rotulo: rotulo,
        });
    }

    showingMenu(event) {
        let arrowParent = event.target.parentElement.parentElement;
        arrowParent.classList.toggle("showMenu");
    }

    responseHandler() {
        let msg = this.state.msg;
        if (msg === 'Salir') {
            return <Link className='link' to="/" />
        } else if (msg) {
            return <p>Issa porra</p>
        }
    }



    render() {
        let afterResponse = this.responseHandler();
        let auth = this.context;
        return (
            <div>
                {afterResponse}
                {/* <img id='bg' className='bg' src='https://cdguzman.tecnm.mx/pag/img/galeria/itcg/IMG_4756.JPG' alt='' /> */}
                <div className="sidebar close">
                    <div className="logo-details">
                        <Link className='link' to="/supervisor/home">
                            {/* <i className='bx bx-store' ></i> */}
                            {/* <img src='/home/vrvg/Documents/SGCFRONT/fron/src/itcg.jpg'></img> */}
                            <i className='bx bxs-school'></i>
                        </Link>
                        <span className="logo_name">SGC</span>
                    </div>
                    <ul className="nav-links">

                        <li>
                            <Link to="/supervisor/reportes/check">
                                <div className="iocn-link">
                                    <span className='a'>
                                        <i className='bx bx-line-chart' ></i>
                                        <span className="link_name">Reportes</span>
                                    </span>
                                    <i
                                        className='bx bxs-chevron-down arrow'
                                        onClick={e => this.showingMenu(e)} >
                                    </i>
                                </div>
                            </Link>
                            <ul className="sub-menu">
                                <li><span className='a'><span className="link_name">Reportes</span></span></li>
                                <Link className='link' to="/supervisor/reportes/check"><li className='li'>Check</li></Link>
                            </ul>
                        </li>



                        <li>
                            <Link className='link' to="/supervisor/exportardatos" >
                                <div className="iocn-link">
                                    <span className='a'>
                                        <i className='bx bxs-file-export' ></i>
                                        <span className="link_name">Exporta Datos</span>
                                    </span>
                                    <i
                                        className='bx bxs-chevron-down arrow'
                                        onClick={e => this.showingMenu(e)} >
                                    </i>
                                </div>
                            </Link>
                            <ul className="sub-menu">
                                <li><span className='a'><span className="link_name">Exportar Datos</span></span></li>
                                <Link className='link' to="/supervisor/exportardatos"><li className='li'></li></Link>
                            </ul>
                        </li>




                        <li>
                            <div className="profile-details">
                                <Link className='link' to="/">
                                    <div className="profile-content">
                                        <i className='bx bx-log-out' onClick={auth.signout}></i>
                                    </div>
                                </Link>

                            </div>
                        </li>
                    </ul>
                </div>
                <section className="home-section">
                    <div className="home-content">
                        <i className='bx bx-menu' onClick={(e) => this.toggleMenu(e)}></i>
                        <span className="text">{this.state.rotulo}</span>
                        {/* Ver si se puede cambiar inicio dependiendo de donde este */}
                    </div>
                </section>
                <Outlet />
            </div>
        );
    }
}
Nav.contextType = AuthContext;

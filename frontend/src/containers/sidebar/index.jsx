import { useState, useEffect } from "react";
import { Links } from '../sidebar/Data/index'
import Item from "./Item";
import './sidebar.scss';
import userPhoto from '../../assets/images/UserPhoto.png'
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setToken }) => {

    /*Estados generales*/
    const [open, setOpen] = useState(false);
    const [logout, setLogout] = useState(false);
    const [dataUser, setDataUser] = useState(false);

    /*Método imperactivo para cambiar de localización en el software*/
    let navegate = useNavigate();

    /*Función para salir del software e ir al login*/
    const handleLogout = () => {
        setLogout(!logout);
        localStorage.removeItem('token');
        setTimeout(() => {
            setToken();
            navegate("/");
            setLogout(false);
        }, 2000);

    }

    /*Función para tener los datos del usuario que acaba de entrar al software*/
    const getData = () => {

        let usuario = localStorage.getItem('usuario');
        let img = localStorage.getItem('img');
        let rol = localStorage.getItem('rol');
        let id = localStorage.getItem('id');

        setDataUser({
            usuario: usuario,
            img: img,
            rol: rol,
            id: id
        })

    }

    /*Funciones que se ejecutarán cuando se renderice la página*/
    useEffect(() => {

        getData();

    }, [])

    return (
        <>
            <div className={open ? "sidebarOpen" : "sidebar"}>
            <div className={open ? "centrarOpen" : ""}>
                    <img src={dataUser.img == 'undefined' ? userPhoto : dataUser.img}
                        alt=""
                        className="hamburger"
                        onClick={() => setOpen(!open)} />
                </div>

                <div className="d-flex justify-content-center align-items-center p-3 name">
                    <p>{!dataUser ? '' : dataUser.usuario}</p>
                </div>

                <ul className="salida">

                    <li>
                        <a onClick={handleLogout} >
                            <svg fill="white" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
                            </svg>
                        </a>
                    </li>
                </ul>


                <div className="linksContainer">
                    {Links && Links.map(({ text, to, svg }) => (
                        <Item key={text} open={open} to={to} svg={svg} text={text}>{text}</Item>
                    ))}
                </div>

                <div className={logout ? "text-center" : "cargando"}>
                    <div className="spinner-grow text-info" role="status">
                    </div>
                </div>


            </div>


        </>
    )

}

export default Sidebar;
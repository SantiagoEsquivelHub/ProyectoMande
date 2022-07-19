import { useState } from "react";
import { Links } from '../sidebar/Data/index'
import Item from "./Item";
import './sidebar.scss';
import userPhoto from '../../assets/images/UserPhoto.png'
import { useNavigate } from "react-router-dom";
const Sidebar = ({setToken}) => {

    const [open, setOpen] = useState(false);
    const [logout, setLogout] = useState(false);

    let navegate = useNavigate();
    const handleLogout = () => {
        setLogout(!logout);
        localStorage.removeItem('token');
        setTimeout(() => {
            setToken();
           navegate("/");
           setLogout(false);
        }, 5000);
        

    }
    return (
        <>
            <div className={open ? "sidebarOpen" : "sidebar"}>
                {/*            <svg
                className="hamburger"
                onClick={() => setOpen(!open)}
                viewBox="0 0 18 12"
            >
                <path
                    d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z"
                    fill="#8F8F8F"
                />
            </svg> */}
                <div className={open ? "centrarOpen" : ""}>
                    <img src={userPhoto}
                        alt=""
                        className="hamburger"
                        onClick={() => setOpen(!open)} />
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
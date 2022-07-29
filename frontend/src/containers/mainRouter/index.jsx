import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'
import EmployeeView from '../../modules/EmployeeView';

import SearchEmployeesView from '../../modules/SearchEmployees';
import ErrorView from '../../security/views/error';
import LoginView from '../../security/views/login';
import Sidebar from '../sidebar';
import MyEmployeesView from '../../modules/MyEmployees'

const MainRouter = ({ location }) => {

    /*Estados generales para recepción del token*/
    const [token, setToken] = useState();
    const tokenLocal = localStorage.getItem('token');

    /*Variables globales*/
    let rol = localStorage.getItem('rol');
    let id = localStorage.getItem('id');
    let ruta = `/staff/${id}`


    /*Si no tenemos un token, significa que el usuario no puede ingresar al software y lo redireccionamos al Login*/
    if (!token && tokenLocal == undefined) {
        return <LoginView setToken={setToken} />
    }

    /*Si el rol del usuario es Administrador, entonces lo redireccionamos al Dashboard*/
    if (rol == 'cliente' && location.pathname === '/') {
        console.log(location.pathname)
        return <Navigate to='/main' />;
    }

    /*Si el rol del usuario es Barbero, entonces lo redireccionamos a su respectiva interna*/
    if (rol == 'trabajador' && location.pathname === '/') {
        return <Navigate to={ruta} />;
    }

    MyEmployeesView


    return (
        <>
            {/* Componente SideBar, el cual nos permite navegar entre los módulos*/}
            <Sidebar setToken={setToken} />

            {/* Rutas principales condicionadas según el rol del usuario, si algún barbero trata de entrar a una sección que no le corresponde, no se le cargará la información */}
            <Routes>
                <Route path='/main' element={rol == 'Barbero' ? (<ErrorView />) : <SearchEmployeesView />} />
                <Route path='/employees' element={rol == 'Barbero' ? (<ErrorView />) : <MyEmployeesView />} />
                <Route path='/profile/:id' element={rol == 'Cliente' ? (<ErrorView />) : <EmployeeView />} />
                <Route path='/*' element={<ErrorView />} />
            </Routes>

        </>
    )

}

export default MainRouter;
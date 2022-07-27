import React, { useState } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'
import EmployeeView from '../../modules/EmployeeView';
import myEmployeesView from '../../modules/myEmployees';
import searchEmployeesView from '../../modules/searchEmployees';
import ErrorView from '../../security/views/error';
import LoginView from '../../security/views/login';
import Sidebar from '../sidebar';

const MainRouter = ({ location }) => {

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
    if (rol == 'Cliente' && location.pathname === '/') {
        return <Navigate to='/main' />;
    }

    /*Si el rol del usuario es Barbero, entonces lo redireccionamos a su respectiva interna*/
    if (rol == 'Trabajador' && location.pathname === '/') {
        return <Navigate to={ruta} />;
    }

    return (
        <>
            <Sidebar setToken={setToken} />

            <Routes>
                <Route path='/main' element={rol == 'Barbero' ? (<ErrorView />) : <searchEmployeesView />} />
                <Route path='/employees' element={rol == 'Barbero' ? (<ErrorView />) : <myEmployeesView />} />
                <Route path='/profile/:id' element={rol == 'Cliente' ? (<ErrorView />) :<EmployeeView />} />
                <Route path='/*' element={<ErrorView />} />
            </Routes>

        </>
    )

}

export default MainRouter;
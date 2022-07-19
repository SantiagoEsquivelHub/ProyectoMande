import React, { useState } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'
import myEmployeesView from '../../modules/myEmployees';
import searchEmployeesView from '../../modules/searchEmployees';
import LoginView from '../../security/views/login';
import Sidebar from '../sidebar';

const MainRouter = ({ location }) => {

    const [token, setToken] = useState();
    const tokenLocal = localStorage.getItem('token');
    if (!token && tokenLocal == undefined) {
      return <LoginView setToken={setToken} />
    }

    if (location.pathname === '/') {
        return <Navigate to='/main' />;
    }

    return (
        <>
           <Sidebar setToken={setToken}/>
            
                <Routes>
                    <Route path='/main' element={<searchEmployeesView />} />
                    <Route path='/employees' element={<myEmployeesView />} />
                    {/* <Route path='/staff/:id' element={<StaffUserView />} />
                    <Route path='/users' element={<UsersView />} /> */}
                   {/*  <Route path='/*' element={<ErrorView />} /> */}
                </Routes>
            
        </>
    )

}

export default MainRouter;
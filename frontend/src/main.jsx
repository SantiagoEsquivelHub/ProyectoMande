import React from 'react';
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter as Router, Navigate, useLocation } from 'react-router-dom'
import MainRouter from './containers/mainRouter/index'
import 'antd/dist/antd.css';

const App = () => {

  const location = useLocation();
  if (location.pathname === '/*') {
   
}

  return (

  
      <Routes>
        <Route path='/*' element={<MainRouter location={location}/>} />
      </Routes>
   /*  */

  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)

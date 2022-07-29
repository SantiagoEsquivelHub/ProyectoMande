import React from 'react';
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter as Router, useLocation } from 'react-router-dom'
import MainRouter from './containers/mainRouter/index'
import 'antd/dist/antd.css';

const App = () => {

  const location = useLocation();
  
  return (
    /*Al ingresar al software nos movemos al componente MainRouter, en dónde tenemos las rutas principales*/
    <Routes>
      <Route path='/*' element={<MainRouter location={location} />} />
    </Routes>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)

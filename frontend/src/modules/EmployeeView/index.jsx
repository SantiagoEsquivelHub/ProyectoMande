import React from 'react'
import { useParams } from 'react-router-dom';

const EmployeeView = () => {
    let params = useParams();

    return (
        <div className='contenedor_main'>
            
            <h1>Mi perfil</h1>
            <h4>{params.id}</h4>
        </div>


    )
}

export default EmployeeView;
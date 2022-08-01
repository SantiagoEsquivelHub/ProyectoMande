import React, { useState, useEffect } from 'react'
import { headers } from '../../containers/headers/headers';
import CardHiredEmployee from './CardHiredEmployee';

const MyEmployeesView = () => {

    const [employees, setEmployees] = useState(false);


    const getHiring = async () => {

        let id = localStorage.getItem('id');
        let tipo = localStorage.getItem('rol') == 'cliente' ? 'id_cliente' : 'id_trabajador';


        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                id: id,
                tipo: tipo
            })
        }

        const resp = await fetch(`http://${document.domain}:4001/api/hiring/get/`, requestOptions);
        const data = await resp.json();
        console.log(data)
        setEmployees(data);
    }

    useEffect(() => {

        getHiring();

    }, [])


    return (
        <div className='contenedor_main'>
            <h1>Mis empleados</h1>

            {
                 employees.length  == 0 || !employees ? 'Sin contrataciones...' :
                    employees.map(emp => {
                        return <CardHiredEmployee
                            nombre={emp.nombre_trabajador}
                            precio={emp.precio_hora_labor}
                            labor={emp.nombre_labor}
                            estado_contratacion={emp.nombre_estado_contratacion}
                            foto={emp.url_foto_perfil}
                        />

                    })

            }
        </div>
    )
}

export default MyEmployeesView;

import React, { useState, useEffect } from 'react'
import { headers } from '../../containers/headers/headers';
import CardHiredEmployee from './CardHiredEmployee';
import Card from 'react-bootstrap/Card';
import { Timeline } from 'antd'
/*Componente usado para mostrar toda la informacion relacionada con las contrataciones de un cliente*/

const MyEmployeesView = () => {

    /*Estados generales*/
    const [employees, setEmployees] = useState(false);
    const [historial, setHistorial] = useState(false);
    
    /*Función para traer todas las contrataciones que tiene un cliente*/
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

        setEmployees(data);
    }

    /*Funciónes que se van a ejecutar apenas se renderice la página*/
    useEffect(() => {

        getHiring();

    }, [])

    /*Función para obtener el historial de contrataciones de un cliente*/


    return (
        <div className='contenedor_main'>
            <h1>Mis empleados</h1>
            <div className='d-flex'>
                {
                    employees.length == 0 || !employees ? 'Sin contrataciones...' :
                        employees.map(emp => {
                            return <CardHiredEmployee
                                key={emp.id_trabajador}
                                nombre={emp.nombre_trabajador}
                                precio={emp.precio_hora_labor}
                                labor={emp.nombre_labor}
                                estado_contratacion={emp.nombre_estado_contratacion}
                                foto={emp.url_foto_perfil}
                                id={emp.id_trabajador}
                            />

                        })

                }
            </div>

            <div className='timeline_interna col-6'>
                <Card className='m-3' >
                    <Card.Body>
                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <Card.Title className=''>Historial</Card.Title>
                        </div>
                        <div>

                            {!historial || historial.length == 0 ? 'Sin información' :

                                historial.map(element => {

                                    return <Timeline.Item color='#fdc43f'>
                                        <p className='yellow'>{element.nombre_servicio}</p>
                                        <p>{element.nombre_cliente}</p>
                                        <p>{element.fecha_cita}</p>
                                        <p className='precio'>${element.precio_servicio}</p>
                                    </Timeline.Item>


                                })

                            }
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default MyEmployeesView;

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { headers } from '../../containers/headers/headers';
import CardHiredEmployee from '../MyEmployees/CardHiredEmployee';
import Card from 'react-bootstrap/Card';
import {
    Modal,
    Form,
    Input,
    Button,
    Col,
    Row,
    Select,
    Timeline,
    notification,
    Rate
} from 'antd';

const EmployeeView = () => {

    let params = useParams();

    const [client, setClient] = useState(false);
    const [historial, setHistorial] = useState(false);
    /*Función para traer todas las contrataciones que tiene un trabajador*/

    const getHiring = async () => {

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                id: params.id,
                tipo: 'id_trabajador'
            })
        }

        const resp = await fetch(`http://${document.domain}:4001/api/hiring/get/`, requestOptions);


        if (resp.status == 200) {

            const data = await resp.json();
            setClient(data);
            console.log(data)
        } else {

        }

    }

    /*Función para obtener el historial de contrataciones de un cliente*/
    const getHistorial = async () => {


        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                id: params.id,
                tipo: 'id_trabajador',
            })
        }

        const resp = await fetch(`http://${document.domain}:4001/api/hiring/historial`, requestOptions)

        if (resp.status == 200) {
            const data = await resp.json();
            setHistorial(data)
            console.log(data)
        } else {

        }


    }

    /*Funciones que se van a ejecutar apenas se renderice la página*/
    useEffect(() => {

        getHiring();
        getHistorial();

    }, [])


    return (
        <div className='contenedor_main'>

            <h1>Mi perfil</h1>
            <h5 className='mb-2'>Clientes</h5>

            <div className='d-flex'>
                {
                    client.length == 0 || !client ? 'Sin contrataciones...' :
                        client.map(client => {
                            return <CardHiredEmployee
                                key={client.id_cliente}
                                nombre={client.nombre_cliente}
                                precio={client.precio_hora_labor}
                                labor={client.nombre_labor}
                                estado_contratacion={client.nombre_estado_contratacion}
                                id={client.id_cliente}
                                id_contratacion={client.id_contratacion}
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

                                    return <Timeline.Item color='#05F3C8'>
                                        <p className='yellow'>{element.nombre_cliente}</p>
                                        <p>{element.nombre_labor}</p>
                                        <p>{element.fecha_contratacion}</p>
                                        <p className='precio'>${element.pago}</p>
                                        <Rate style={{color: '#44d2ff'}} disabled defaultValue={element.calificacion_contratacion} />
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

export default EmployeeView;
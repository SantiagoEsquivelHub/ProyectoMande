import React, { useState, useEffect } from 'react'
import './style.css'
import {
    Button,
    Form,
    Modal,
    Col,
    Row,
    Input
} from 'antd';
import OpenEmployee from '../../../containers/openEmployee';
import { useGetEmployees } from '../../../hooks/useGetEmployees'
import { headers } from '../../../containers/headers/headers';
import iconUser from '../../../assets/images/User.png';

const CardHiredEmployee = ({ nombre, precio, labor, estado_contratacion, foto, id, id_contratacion }) => {

    /*Estados generales*/
    const [workerInfo, setWorkerInfo] = useState(false);
    const [visibleWatchWorker, setVisibleWatchWorker] = useState(false);
    const [visibleFinishedJob, setVisibleFinishedJob] = useState(false);
    const [cardsClient, setCardsClient] = useState(false);
    const [hoursWorked, setHoursWorked] = useState({
        horas_laboradas: ''
    })
    const [formJob] = Form.useForm();
    let id_cliente = localStorage.getItem('id');
    let direccion_cliente = localStorage.getItem('direccion')
    let rol = localStorage.getItem('rol')

    /*Función que muestra un modal con la información del trabajador*/
    const openEmployee = (e) => {

        let idWorker = e.target.id;

        getEmployees(idWorker);

        setVisibleWatchWorker(true)

    }

    /*Función para obtener la data de cada usuario*/
    const getEmployees = async (idWorker) => {

        const data = await useGetEmployees(idWorker);
        console.log(data)
        setWorkerInfo(data);
    }

    /*Función quecierra un modal con la información del trabajador*/
    const handleCancelWorker = () => {
        setVisibleWatchWorker(false);
    };

    /*Función para obtener todas las tarjetas de un cliente*/
    const getCardsClient = async () => {

        const requestOptions = {
            method: 'GET',
            headers: headers
        }

        const resp = await fetch(`http://${document.domain}:4001/api/card/getCardsClient/` + id_cliente, requestOptions);
        const data = await resp.json();
        setCardsClient(data)

    }

    /*Función para actualizar los datos del trabajador cada vez que hace cambios en los inputs de su formulario*/
    const handleInputChangeFinishedJob = (e) => {

        setHoursWorked({
            [e.target.name]: e.target.value
        })
        console.log(hoursWorked)
    }

    /*Función para cerrar modal que permite terminar trabajo*/
    const handleCancelFinishedJob = () => {
        setVisibleFinishedJob(false);
    }

    /*Función para mostrar modal que permite terminar trabajo*/
    const showModalFinishedJob = () => {
        setVisibleFinishedJob(true);
    }

    /*Función que permite terminar trabajo*/
    const handleSubmitFinishedJob = () => {

    }

    /*Funciones que se van a ejecutar apenas se renderice la página*/
    useEffect(() => {

        {
            rol == 'cliente' ? getCardsClient() : ''
        }

    }, [])

    return (
        <>
            <div className="cardHiredEmployee m-3 d-flex justify-content-center align-items-center flex-column">
                <img src={foto == null ? iconUser : foto} alt="foto_perfil" className='m-2' style={{ width: '100px' }} />
                <p style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={openEmployee} id={id}>{nombre}</p>
                <p>${precio} por hora</p>
                <p>{labor}</p>
                <p className={estado_contratacion == 'Trabajando' ? 'deshabilitado' : 'activo'} style={{ width: '170px' }}>{estado_contratacion}</p>

                {
                    !cardsClient ? '' :
                        <Button type="primary" className={rol == 'cliente' && estado_contratacion != 'Pendiente de pago' ? 'ocultar' : 'mb-3'}>Pagar</Button>

                }
                <Button type="primary" className={rol == 'trabajador' && estado_contratacion == 'Trabajando' ? 'mb-3' : 'ocultar'} precio={precio} id_contratacion={id_contratacion} onClick={showModalFinishedJob}>Terminar</Button>
            </div>


            {
                !workerInfo ? '' :
                    <Modal
                        style={{
                            top: 20,
                        }}
                        visible={visibleWatchWorker}
                        title={rol == 'Trabajador' ? "Ver trabajador" : "Ver cliente"}
                        onCancel={handleCancelWorker}
                        width="800px"
                        footer={[

                        ]}
                    >
                        <OpenEmployee
                            nombre={rol == 'cliente' ? workerInfo.nombre_trabajador : workerInfo.nombre_cliente}
                            correo={rol == 'cliente' ? workerInfo.email_trabajador : workerInfo.nombre_cliente}
                            celular={rol == 'cliente' ? workerInfo.numero_celular_trabajador : workerInfo.nombre_cliente}
                            direccion_cliente={direccion_cliente}
                            direccion_trabajador={workerInfo.direccion_residencia_trabajador}
                            img={workerInfo.url_foto_perfil}
                        />
                    </Modal>

            }

            <Modal
                style={{
                    top: 20,
                }}
                visible={visibleFinishedJob}
                title="Terminar trabajo"
                onCancel={handleCancelFinishedJob}
                width="800px"
                footer={[

                ]}
            >
                <Form form={formJob} name="terminarTrabajo" className="terminarTrabajo" id="terminarTrabajo" onFinish={handleSubmitFinishedJob}>
                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="horas_laboradas" label="Horas laboradas" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="number" pattern="([1-9]{1,3})" title="Ingresa un número de horas válido" onChange={handleInputChangeFinishedJob} name="horas_laboradas" />
                                </Form.Item>


                            </Col>

                        </div>
                        <div className='d-flex justify-content-center align-items-center m-4'>
                            {
                                <p>{hoursWorked.horas_laboradas != '' ? `$${hoursWorked.horas_laboradas * precio} pesos` : '$0 pesos'}</p>
                            }
                        </div>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default CardHiredEmployee;

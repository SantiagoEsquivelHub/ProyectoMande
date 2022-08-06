import React, { useState, useEffect } from 'react'
import './style.css'
import {
    Button,
    Form,
    Modal,
    Col,
    Row,
    Input,
    notification,
    Select,
    Rate
} from 'antd';
import OpenEmployee from '../../../containers/openEmployee';
import { useGetEmployees } from '../../../hooks/useGetEmployees'
import { headers } from '../../../containers/headers/headers';
import iconUser from '../../../assets/images/User.png';

const CardHiredEmployee = ({ nombre, precio, labor, estado_contratacion, foto, id, id_contratacion }) => {

    /*Estados generales*/
    const [infoToPay, setInfoToPay] = useState();
    const [value, setValue] = useState(0);
    const [loadingFinishedJob, setLoadingFinishedJob] = useState(false);
    const [loadingPayJob, setLoadingPayJob] = useState(false);
    const [workerInfo, setWorkerInfo] = useState(false);
    const [visibleWatchWorker, setVisibleWatchWorker] = useState(false);
    const [visibleFinishedJob, setVisibleFinishedJob] = useState(false);
    const [visiblePayJob, setVisiblePayJob] = useState(false);
    const [datosPagar, setDatosPagar] = useState({
        id_contratacion: '',
        calificacion_contratacion: '',
        id_tarjeta_de_pago: ''
    });
    const [cardsClient, setCardsClient] = useState(false);
    const [hoursWorked, setHoursWorked] = useState({
        horas_laboradas: '',
        pago: '',
        id_contratacion: ''
    })
    const [formJob] = Form.useForm();
    const [formPayJob] = Form.useForm();
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
        setWorkerInfo(data);
    }

    /*Función quecierra un modal con la información del trabajador*/
    const handleCancelWorker = () => {
        setVisibleWatchWorker(false);
    };

    /*Función para obtener la informacion de las horas que hizo el trabajador y el total a pagar*/
    const getInfoToPay = async () => {

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                id_contratacion: id_contratacion
            })
        }

        const resp = await fetch(`http://${document.domain}:4001/api/hiring/getInfo`, requestOptions);
        const data = await resp.json();
        setInfoToPay(data);

    }

    /*Función para obtener todas las tarjetas de un cliente*/
    const getCardsClient = async () => {

        const requestOptions = {
            method: 'GET',
            headers: headers
        }

        const resp = await fetch(`http://${document.domain}:4001/api/card/getInfoCardsClient/` + id_cliente, requestOptions);
        const data = await resp.json();
        setCardsClient(data)
    }

    /*Función para actualizar los datos del trabajador cada vez que hace cambios en los inputs de su formulario*/
    const handleInputChangeFinishedJob = (e) => {

        setHoursWorked({
            pago: e.target.value * precio,
            [e.target.name]: e.target.value
        })

    }

    /*Función para actualizar cual elemento de la lista desplegable de tarjetas fue seleccionada*/
    const handleSelectChange = (value) => {
        setDatosPagar({
            ...datosPagar,
            id_tarjeta_de_pago: `${value}`,
            id_contratacion: `${id_contratacion}`
        })
    }

    /*Función para actualizar la calificacion del trabajo*/
    const handleCalification = (value) => {
        setDatosPagar({
            ...datosPagar,
            calificacion_contratacion: `${value}`
        })
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
    const handleSubmitFinishedJob = async () => {

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                ...hoursWorked,
                id_contratacion: id_contratacion
            })
        }

        const resp = await fetch(`http://${document.domain}:4001/api/hiring/update`, requestOptions);

        if (resp.status == 200) {
            setLoadingFinishedJob(true);
            openNotificationWithIconSuccess('success');
            setTimeout(() => {
                window.location.reload()
            }, 2000);

        } else {
            openNotificationWithIcon('warning')
        }
    }

    /*Función que permite pagar trabajo*/
    const handleSubmitPayJob = async () => {

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                ...datosPagar
            })
        }

        console.log(JSON.stringify({
            ...datosPagar
        }))
        const resp = await fetch(`http://${document.domain}:4001/api/hiring/updatePay`, requestOptions);

        if (resp.status == 200) {
            setLoadingPayJob(true);
            openNotificationWithIconSuccess('success');
            setTimeout(() => {
                window.location.reload()
            }, 2000);

        } else {
            openNotificationWithIcon('warning')
        }
    }

    /*Función para cerrar modal que permite pagar el trabajo*/
    const handleCancelPayJob = () => {
        setVisiblePayJob(false);
    }

    /*Función para mostrar modal que permite pagar el trabajo*/
    const showModalPayJob = async () => {
        setVisiblePayJob(true);
        getCardsClient();
        getInfoToPay();
    }

    /*Función para mostrar notificación cuando no se logre terminar la contratacion por algun motivo*/
    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: '¡Terminación de trabajo sin exito!',
            description:
                'No se pudo terminar el trabajo. Inténtalo de nuevo :)',
        });
    };

    /*Función que muestra una notificación cuando se ha logrado terminar la contratacion*/
    const openNotificationWithIconSuccess = (type) => {
        notification[type]({
            message: '¡Terminación de trabajo registrado correctamente!',
            description:
                'El trabajo ha sido terminado correctamente :)',
        });
    };



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
                        <Button type="primary" className={rol == 'cliente' && estado_contratacion != 'Pendiente de pago' ? 'ocultar' : 'mb-3'} id_contratacion={id_contratacion} onClick={showModalPayJob}>Pagar</Button>

                }
                <Button type="primary" className={rol == 'trabajador' && estado_contratacion == 'Trabajando' ? 'mb-3' : 'ocultar'} onClick={showModalFinishedJob}>Terminar</Button>
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
                visible={visiblePayJob}
                title="Pagar trabajo"
                onCancel={handleCancelPayJob}
                width="1000px"
                footer={[

                ]}
            >
                <Form form={formPayJob} name="pagarTrabajo" className="pagarTrabajo" id="pagarTrabajo" onFinish={handleSubmitPayJob}>
                    <Row className='col-12 d-flex flex-column'>
                        <div className='d-flex justify-content-center'>
                            {
                                !infoToPay ? '' :
                                    infoToPay.map(info => {
                                        return <div>
                                            <p>{info.horas_laboradas} horas laboradas por el trabajador</p>
                                            <p>${info.pago} por los servicios prestados</p>
                                        </div>

                                    })
                            }
                        </div>

                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="id_tarjeta_de_pago" label="Tus tarjetas" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Select required
                                        defaultValue='Seleccione:'
                                        placeholder=""
                                        onChange={handleSelectChange}
                                        allowClear
                                        name="id_tipo"
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        {!cardsClient ? 'Cargando...' :

                                            cardsClient.map((tarjeta) => {
                                                return <Option key={tarjeta.id_tarjeta} value={tarjeta.id_tarjeta}>{tarjeta.numero_tarjeta}-{tarjeta.nombre_tipo}-{tarjeta.marca_tipo}-{tarjeta.banco_tipo}</Option>

                                            })

                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </div>
                    </Row>

                    <Row className='col-12 d-flex flex-column'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="calificacion_contratacion" label="Calificación" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Rate allowHalf defaultValue={0} style={{ color: '#44d2ff' }} onChange={handleCalification} value={value} />
                                </Form.Item>
                            </Col>
                        </div>
                    </Row>

                    <div className='d-flex justify-content-center mt-1'>
                        <Form.Item >
                            <Button type="primary" htmlType="submit" loading={loadingPayJob} className="btnPayJob">
                                Finalizar
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>


            <Modal
                style={{
                    top: 20,
                }}
                visible={visibleFinishedJob}
                title="Terminar trabajo"
                onCancel={handleCancelFinishedJob}
                footer={[

                ]}
            >
                <Form form={formJob} name="terminarTrabajo" className="terminarTrabajo" id="terminarTrabajo" onFinish={handleSubmitFinishedJob}>
                    <Row className='col-12 d-flex flex-column'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="horas_laboradas" label="Horas laboradas" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="number" min="1" max="100" onChange={handleInputChangeFinishedJob} name="horas_laboradas" />
                                </Form.Item>


                            </Col>

                        </div>
                        <div className='d-flex justify-content-center align-items-center m-4'>
                            {
                                <p>{hoursWorked.horas_laboradas != '' ? `$${hoursWorked.horas_laboradas * precio} pesos` : '$0 pesos'}</p>
                            }
                        </div>
                    </Row>

                    <div className='d-flex justify-content-center mt-1'>
                        <Form.Item >
                            <Button type="primary" htmlType="submit" loading={loadingFinishedJob} className="btnFinishedJob">
                                Finalizar
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default CardHiredEmployee;

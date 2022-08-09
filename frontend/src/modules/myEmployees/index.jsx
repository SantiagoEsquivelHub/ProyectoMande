import React, { useState, useEffect } from 'react'
import { headers } from '../../containers/headers/headers';
import CardHiredEmployee from './CardHiredEmployee';
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

/*Componente usado para mostrar toda la informacion relacionada con las contrataciones de un cliente*/


const { Option } = Select;

const MyEmployeesView = () => {

    /*Estados generales*/
    let id_cliente = localStorage.getItem('id')
    let tipo = localStorage.getItem('rol') == 'cliente' ? 'id_cliente' : 'id_trabajador';
    const [loadingPay, setLoadingPay] = useState(false);
    const [employees, setEmployees] = useState(false);
    const [historial, setHistorial] = useState(false);
    const [isModalVisiblePay, setIsModalVisiblePay] = useState(false);
    const [formPay] = Form.useForm();
    const [tipoTarjeta, setTipoTarjeta] = useState(false);
    const [datosTarjeta, setDatosTarjeta] = useState({
        numero_tarjeta: '',
        clave_tarjeta: '',
        id_tipo: '',
        fecha_caducidad: '',
        id_cliente: id_cliente
    });

    /*Función para traer todas las contrataciones que tiene un cliente*/
    const getHiring = async () => {

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                id: id_cliente,
                tipo: tipo
            })
        }

        const resp = await fetch(`http://${document.domain}:4001/api/hiring/get/`, requestOptions);
        const data = await resp.json();

        setEmployees(data);
    }

    /*Función para mostrar el modal que contiene el formulario para crear tarjetas*/
    const showModalPay = async () => {
        setIsModalVisiblePay(true);
        const data = await getCardTypes();
        setTipoTarjeta(data)
    };

    /*Función para cerrar el modal que contiene el formulario para crear tarjetas*/
    const handleCancelPay = () => {
        setIsModalVisiblePay(false);
    };

    /*Función para limpiar los campos del formulario de creacion de tarjetas*/
    const onResetPay = () => {
        formClient.resetFields();
    };

    /*Función para crear una tarjeta*/
    const handleSubmitPay = async () => {

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                ...datosTarjeta
            })
        }

        const resp = await fetch(`http://${document.domain}:4001/api/card/create/`, requestOptions)
        console.log(resp)

        if (resp.status == 200) {
            setLoadingPay(true);
            openNotificationWithIconSuccessPay('success')
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            openNotificationWithIconErrorPay('warning');
        }
    }

    /*Función para actualizar los datos de la tarjeta cada vez que hace cambios en los inputs de su formulario*/
    const handleInputChangePay = (e) => {

        setDatosTarjeta({
            ...datosTarjeta,
            [e.target.name]: e.target.value
        })

    }

    /*Función para actualizar cual elemento de la lista desplegable de tipos de tarjetas fue seleccionado*/
    const handleSelectChange = (value) => {
        setDatosTarjeta({
            ...datosTarjeta,
            id_tipo: `${value}`
        })
    }

    /*Función para obtener los tipos de tarjetas*/
    const getCardTypes = async () => {

        const requestOptions = {
            method: 'GET',
            headers: headers
        }

        const resp = await fetch(`http://${document.domain}:4001/api/card/get/`, requestOptions)
        const data = await resp.json();
        return data;
    }

    /*Función para mostrar notificación cuando no se logre crear la tarjeta por algun motivo*/
    const openNotificationWithIconErrorPay = (type) => {
        notification[type]({
            message: 'La tarjeta no ha sido creada!',
            description:
                'Inténtalo de nuevo :)',
        });
    };

    /*Función que muestra una notificación cuando se ha logrado crear la tarjeta*/
    const openNotificationWithIconSuccessPay = (type) => {
        notification[type]({
            message: '¡Tarjeta creada con éxito!',
            description:
                'El medio de pago ha sido registrado correctamente :)',
        });
    };

    /*Función para obtener el historial de contrataciones de un cliente*/
    const getHistorial = async () => {


        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                id: id_cliente,
                tipo: tipo,
            })
        }

        const resp = await fetch(`http://${document.domain}:4001/api/hiring/historial`, requestOptions)
        const data = await resp.json();
        setHistorial(data)

    }

    /*Funciones que se van a ejecutar apenas se renderice la página*/
    useEffect(() => {

        getHiring();
        getHistorial();

    }, [])

    return (
        <div className='contenedor_main'>
            <h1>Mis empleados</h1>
            <div className='m-2'>
                <Button type="dashed" className='m-3' onClick={showModalPay}>Agregar medio de pago</Button>
            </div>
            <div className='d-flex mb-5 justify-content-center'>
                {
                    !employees ? 'Sin contrataciones...' :
                        employees.map(emp => {
                            return <CardHiredEmployee
                                key={emp.id_trabajador}
                                nombre={emp.nombre_trabajador}
                                precio={emp.precio_hora_labor}
                                labor={emp.nombre_labor}
                                estado_contratacion={emp.nombre_estado_contratacion}
                                foto={emp.url_foto_perfil}
                                id={emp.id_trabajador}
                                id_contratacion={emp.id_contratacion}
                                tipo="trabajador"
                            />

                        })

                }
            </div>

            <div className='timeline_interna col-6 centrar'>
                <Card className='m-3' >
                    <Card.Body>
                        <div className='d-flex align-items-center justify-content-center mb-2'>
                            <Card.Title className=''>Historial</Card.Title>
                        </div>
                        <div>
                            <Timeline mode="alternate">
                                {!historial || historial.length == 0 ? <Timeline.Item color='#05F3C8'></Timeline.Item> :

                                    historial.map(element => {

                                        return <Timeline.Item color='#05F3C8'>
                                            <p className='yellow'>{element.nombre_trabajador}</p>
                                            <p>{element.nombre_labor}</p>
                                            <p>{element.fecha_pago}</p>
                                            <p className='precio'>${element.pago}</p>
                                            <Rate style={{ color: '#44d2ff' }} disabled defaultValue={element.calificacion_contratacion} />
                                        </Timeline.Item>


                                    })
                                }
                            </Timeline>

                        </div>
                    </Card.Body>
                </Card>
            </div>
            <Modal title="Agregar medio de pago" visible={isModalVisiblePay} onCancel={handleCancelPay} width={1000} footer={[]}>

                <Form form={formPay} name="crearTarjeta" className="crearTarjeta" id="crearTarjeta" onFinish={handleSubmitPay}>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="numero_tarjeta" label="Número" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" pattern="([0-9]{16})" title="Ingresa un número de tarjeta válido" onChange={handleInputChangePay} name="numero_tarjeta" />
                                </Form.Item>
                                <Form.Item name="id_tipo" label="Tipo" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Select required
                                        defaultValue='Seleccione:'
                                        placeholder=""
                                        onChange={handleSelectChange}
                                        allowClear
                                        name="id_tipo"
                                    >
                                        {!tipoTarjeta ? 'Cargando...' :

                                            tipoTarjeta.map((tipoTarjeta) => {
                                                return <Option key={tipoTarjeta.id_tipo} value={tipoTarjeta.id_tipo}>{tipoTarjeta.nombre_tipo}-{tipoTarjeta.marca_tipo}-{tipoTarjeta.banco_tipo}</Option>

                                            })

                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12} className="m-3">
                                <Form.Item name="clave_tarjeta" label="Clave" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="password" pattern="([0-9]{4})" title="Ingresa una clave de tarjeta válida" onChange={handleInputChangePay} name="clave_tarjeta" />
                                </Form.Item>
                                <Form.Item name="fecha_caducidad" label="Fecha de caducidad" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="date" pattern="([0-9]{10})" title="Ingresa un número de celular válido" onChange={handleInputChangePay} name="fecha_caducidad" />
                                </Form.Item>

                            </Col>
                        </div>
                    </Row>
                    <div className='d-flex justify-content-center'>
                        <Form.Item >
                            <Button htmlType="button" onClick={onResetPay}>
                                Limpiar
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loadingPay} className="btnCrearTarjeta">
                                Crear
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default MyEmployeesView;

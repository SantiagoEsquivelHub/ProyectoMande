import React, { useState } from 'react'
import './style.css'
import {
    Modal,
    Form,
    Input,
    Button,
    Col,
    Row,
} from 'antd';
import OpenEmployee from '../../../containers/openEmployee';
import { useGetEmployees } from '../../../hooks/useGetEmployees'

const layout = {
    labelCol: { span: 20 },
    wrapperCol: { span: 50 },
};

const CardHiredEmployee = ({ nombre, precio, labor, estado_contratacion, foto, id }) => {

    /*Estados generales*/
    const [loadingPay, setLoadingPay] = useState(false);
    const [isModalVisiblePay, setIsModalVisiblePay] = useState(false);
    const [formPay] = Form.useForm();
    const [workerInfo, setWorkerInfo] = useState(false);
    const [visibleWatchWorker, setVisibleWatchWorker] = useState(false)
    let direccion_cliente = localStorage.getItem('direccion')

    const showModalPay = () => {
        setIsModalVisiblePay(true);
    };

    /*Función para limpiar los campos del formulario de creacion de tarjetas*/
    const onResetPay = () => {
        formClient.resetFields();
    };


    const handleSubmitPay = () => {

    }

    /*Función para actualizar los datos de la tarjeta cada vez que hace cambios en los inputs de su formulario*/
    const handleInputChangePay = (e) => {

        setDatosCliente({
            ...datosCliente,
            [e.target.name]: e.target.value
        })

    }

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



    return (
        <>
            <div className="cardHiredEmployee m-3">
                <img src={foto} alt="foto_perfil" className='m-2' />
                <p style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={openEmployee} id={id}>{nombre}</p>
                <p>${precio} por hora</p>
                <p>{labor}</p>
                <p className={estado_contratacion == 'Trabajando' ? 'deshabilitado' : 'activo'}>{estado_contratacion}</p>
                <Button type="dashed" className='mb-3' onClick={showModalPay} id={id}>Agregar medio de pago</Button>
            </div>

            <Modal title="Agregar medio de pago" visible={isModalVisiblePay} footer={[]}>

                <Form {...layout} form={formPay} name="crearCliente" className="crearCliente" id="crearCliente" onFinish={handleSubmitPay}>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="nombre_cliente" label="Nombre completo" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$" title="Ingresa un nombre válido" onChange={handleInputChangePay} name="nombre_cliente" />
                                </Form.Item>
                                <Form.Item name="email_cliente" label="Correo electrónico" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="email" pattern="^[^@]+@[^@]+\.[a-zA-Z]{2,}$" title="Ingresa un correo válido" onChange={handleInputChangePay} name="email_cliente" />
                                </Form.Item>

                            </Col>
                            <Col span={12} className="m-3">
                                <Form.Item name="contraseña_cliente" label="Contraseña" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="password" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$" title="La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula, al menos una mayúscula y al menos un caracter no alfanumérico." onChange={handleInputChangePay} name="contraseña_cliente" />
                                </Form.Item>
                                <Form.Item name="numero_celular_cliente" label="Número de celular" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" pattern="([0-9]{10})" title="Ingresa un número de celular válido" onChange={handleInputChangePay} name="numero_celular_cliente" />
                                </Form.Item>

                            </Col>
                        </div>
                    </Row>
                    <div className='d-flex justify-content-center'>
                        <Form.Item >
                            <Button htmlType="button" onClick={onResetPay}>
                                Reset
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loadingPay} className="btnCrearTarjeta">
                                Crear
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            {
                !workerInfo ? '' :
                    <Modal
                        style={{
                            top: 20,
                        }}
                        visible={visibleWatchWorker}
                        title="Ver trabajador"
                        onCancel={handleCancelWorker}
                        width="800px"
                        footer={[

                        ]}
                    >
                        <OpenEmployee
                            nombre={workerInfo.nombre_trabajador}
                            correo={workerInfo.email_trabajador}
                            celular={workerInfo.numero_celular_trabajador}
                            direccion_cliente={direccion_cliente}
                            direccion_trabajador={workerInfo.direccion_residencia_trabajador}
                            img={workerInfo.url_foto_perfil}
                        />
                    </Modal>

            }
        </>
    )
}

export default CardHiredEmployee;

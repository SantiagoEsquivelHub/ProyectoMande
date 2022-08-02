import React, { useState } from 'react'
import './style.css'
import {
    Modal,
    Form,
    Input,
    Button,
    Col,
    Row,
    Select
} from 'antd';
import OpenEmployee from '../../../containers/openEmployee';
import { useGetEmployees } from '../../../hooks/useGetEmployees'
import { headers } from '../../../containers/headers/headers';

const layout = {
    labelCol: { span: 20 },
    wrapperCol: { span: 50 },
};

const { Option } = Select;

const CardHiredEmployee = ({ nombre, precio, labor, estado_contratacion, foto, id }) => {

    /*Estados generales*/
    const [loadingPay, setLoadingPay] = useState(false);
    const [isModalVisiblePay, setIsModalVisiblePay] = useState(false);
    const [formPay] = Form.useForm();
    const [workerInfo, setWorkerInfo] = useState(false);
    const [visibleWatchWorker, setVisibleWatchWorker] = useState(false);
    const [tipoTarjeta, setTipoTarjeta] = useState(false);
    const [datosTarjeta, setDatosTarjeta] = useState({
        numero_tarjeta: '',
        clave_tarjeta: '',
        id_tipo: '',
        fecha_caducidad: ''
    });
    let direccion_cliente = localStorage.getItem('direccion')

    const showModalPay = async () => {
        setIsModalVisiblePay(true);
        const data = await getCardTypes();
        console.log(data, 'llego')
        setTipoTarjeta(data)
    };

    const handleCancelPay = () => {
        setIsModalVisiblePay(false);
    };

    /*Función para limpiar los campos del formulario de creacion de tarjetas*/
    const onResetPay = () => {
        formClient.resetFields();
    };


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

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {

        }
    }

    /*Función para actualizar los datos de la tarjeta cada vez que hace cambios en los inputs de su formulario*/
    const handleInputChangePay = (e) => {

        setDatosTarjeta({
            ...datosTarjeta,
            [e.target.name]: e.target.value
        })

    }

    const handleSelectChange = (value) => {
        setDatosTarjeta({
            ...datosTarjeta,
            id_tipo: `${value}`
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

            <Modal title="Agregar medio de pago" visible={isModalVisiblePay} onCancel={handleCancelPay} width={800} footer={[]}>

                <Form {...layout} form={formPay} name="crearTarjeta" className="crearTarjeta" id="crearTarjeta" onFinish={handleSubmitPay}>

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

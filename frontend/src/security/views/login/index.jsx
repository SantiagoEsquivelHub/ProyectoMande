import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Col,
    Row,
    Upload,
    notification
} from 'antd';
import MapView from "../map";
import { headers } from "../../../containers/headers/headers";
import './login.css';


const { Option } = Select;
const { Search } = Input;

const layout = {
    labelCol: { span: 20 },
    wrapperCol: { span: 50 },
};


/*Componente usado para validar el ingreso de usuarios*/

const LoginView = ({ setToken }) => {

    /*Estados generales para recepción de datos del usuario*/
    const [loading, setLoading] = useState(false);
    const [loadingClient, setLoadingClient] = useState(false);
    const [loadingWorker, setLoadingWorker] = useState(false);
    const [formClient] = Form.useForm();
    const [formWorker] = Form.useForm();
    const [visibleWorkerModal, setVisibleWorkerModal] = useState(false);
    const [visibleClientModal, setVisibleClientModal] = useState(false);
    const [user, setUser] = useState(false);
    const [datos, setDatos] = useState({
        usuario: "",
        clave: ""
    });

    const [datosCliente, setDatosCliente] = useState({
        url_recibo_publico: "",
        email_cliente: "",
        numero_celular_cliente: "",
        direccion_residencia_cliente: "",
        nombre_cliente: "",
        contraseña_cliente: "",
        rol_cliente: "Cliente"
    });

    const [datosTrabajador, setDatosTrabajador] = useState({
        url_foto_perfil: "",
        url_documento: "",
        email_trabajador: "",
        numero_celular_trabajador: "",
        direccion_residencia_trabajador: "",
        nombre_trabajador: "",
        contraseña_trabajador: "",
        rol_trabajador: "Trabajador",
        precio_hora_labor_plomero: null,
        precio_hora_labor_cerrajero: null,
        precio_hora_labor_profesor: null,
        precio_hora_labor_paseador: null
    });

    /*Función para mostrar notificación cuando no se pudo crear el usuario en la base de datos*/
    const openNotificationWithIconCreate = (type) => {
        notification[type]({
            message: '¡Creación de usuario fallida!',
            description:
                'No se pudo crear el usuario. Inténtalo de nuevo :)',
        });
    };

    /*Función para mostrar notificación cuando los datos del usuario para el login son incorrectos*/
    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: '¡Credenciales incorrectas!',
            description:
                'Los datos ingresados son incorrectos. Vefifícalos e inténtalo de nuevo :)',
        });
    };

    /*Función que muestra una notificación cuando se ha logrado crear un usuario*/
    const openNotificationWithIconSuccess = (type) => {
        notification[type]({
            message: '¡Usuario creado correctamente!',
            description:
                'Los datos ingresados son correctos :)',
        });
    };

    /*Función para actualizar los datos del usuario cada vez que hace cambios en los inputs del formulario del login*/
    const handleInputChange = (e) => {
        let { name, value } = e.target;
        let newDatos = { ...datos, [name]: value };
        setDatos(newDatos);
    }

    /*Función para enviar los datos ingresados por el usuario para saber si puede ingresar o no*/
    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            let res = await axios.post(`http://${document.domain}:4001/api/auth/login`, datos);
            setUser(!user);
            setTimeout(() => {
                const accessToken = res.data.token;
                setToken(accessToken);
                localStorage.setItem("token", accessToken);
                setDatos({
                    usuario: "",
                    clave: ""
                })
                localStorage.setItem('usuario', res.data.nombre)
                localStorage.setItem('img', res.data.url_foto_perfil)
                localStorage.setItem('rol', res.data.rol)
                localStorage.setItem('id', res.data.id)
                localStorage.setItem('direccion', res.data.direccion)
            }, 2000);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                openNotificationWithIcon('warning');
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log(error.message);
            }
        }
    };

    /*Función y objetos del antd requeridos para el uso del componente Upload*/
    const props = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e.fileList;
        }

        return e.fileList;
    };


    /*Función para mostrar modal con el formulario del cliente*/
    const showClientModal = () => {
        setVisibleClientModal(true);
    };

    /*Función para mostrar modal con el formulario del trabajador*/
    const showWorkerModal = () => {
        setVisibleWorkerModal(true);
    };

    /*Función para cerrar modal con el formulario del cliente*/
    const handleCancelClient = () => {
        setVisibleClientModal(false);
    };

    /*Función para cerrar modal con el formulario del trabajador*/
    const handleCancelWorker = () => {
        setVisibleWorkerModal(false);
    };

    /*Función para limpiar los campos del formulario del cliente*/
    const onResetClient = () => {
        formClient.resetFields();
    };

    /*Función para limpiar los campos del formulario del trabajador*/
    const onResetWorker = () => {
        formWorker.resetFields();
    };

    /*Función para crear clientes*/
    const handleSubmitClient = async () => {

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                ...datosCliente
            })
        }

        const resp = await fetch(`http://${document.domain}:4001/api/client/create`, requestOptions)

        if (resp.status == 200) {
            openNotificationWithIconSuccess('success');
            setLoadingClient(true);

            setTimeout(() => {
                setLoadingClient(false);
                setVisibleClientModal(false);
                onResetClient();
                window.location.reload();
            }, 2000);
        } else {
            openNotificationWithIconCreate('warning')
        }


    }

    /*Función para crear trabajadores*/
    const handleSubmitWorker = async () => {

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                ...datosTrabajador,
                id_estado: '1'
            })
        }

        const respEmp = await fetch(`http://${document.domain}:4001/api/worker/create`, requestOptions)
        console.log(respEmp)


        if (respEmp.status == 200) {
            openNotificationWithIconSuccess('success');
            setLoadingWorker(true);

            setTimeout(() => {
                setLoadingWorker(false);
                setVisibleWorkerModal(false);
                onResetWorker();
                window.location.reload();
            }, 2000);
        } else {
            openNotificationWithIconCreate('warning')
        }


    }

    /*Función para actualizar los datos del cliente cada vez que hace cambios en los inputs de su formulario*/
    const handleInputChangeRegisterClient = (e) => {

        setDatosCliente({
            ...datosCliente,
            [e.target.name]: e.target.value
        })

    }

    /*Función para actualizar los datos del trabajador cada vez que hace cambios en los inputs de su formulario*/
    const handleInputChangeRegisterEmployee = (e) => {

        setDatosTrabajador({
            ...datosTrabajador,
            [e.target.name]: e.target.value
        })

    }

    /*Función para convertir la URL del adjunto que suben al formulario de crear cliente en base64 y almacenarlo en el estado global*/
    const getUrl = async () => {
        const fileInput = document.getElementById('url_recibo_publico');
        const selectedFile = fileInput.files[0];

        const btn = document.getElementsByClassName('btnCrearCliente');

        if (selectedFile.type != "application/pdf") {

            alert("Solo se permiten imágenes en PDF")
            fileInput.value = "";

            btn[0].setAttribute('disabled', 'true');
        } else {
            btn[0].removeAttribute('disabled');


            let result = await getBase64(selectedFile);
            let url = result;

            setDatosCliente({
                ...datosCliente,
                [fileInput.id]: url
            })
        }
    }

    /*Función para convertir la URL de los adjuntos que suben al formulario de crear trabajador en base64 y almacenarlo en el estado global*/
    const getUrlImg = async (nameInput) => {
        const fileInput = document.getElementById(nameInput);
        const selectedFile = fileInput.files[0];

        const btn = document.getElementsByClassName('btnCrearTrabajador');

        if (nameInput == 'url_foto_perfil' ? selectedFile.type != "image/png" && selectedFile.type != "image/jpeg" && selectedFile.type != "image/jpg" : selectedFile.type != "application/pdf") {

            nameInput == 'url_foto_perfil' ? alert("Solo se permiten imágenes en PNG, JPG y JPEG") : alert("Solo se permiten imágenes en PDF")
            fileInput.value = "";

            btn[0].setAttribute('disabled', 'true');
        } else {
            btn[0].removeAttribute('disabled');


            let result = await getBase64(selectedFile);
            let url = result;

            setDatosTrabajador({
                ...datosTrabajador,
                [fileInput.id]: url
            })
        }
    }

    /*Hook para convertir una URL en base 64*/
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        });

    return (
        <>

            <section className="background h-100">
                <div className="h-100">
                    <div className="row g-0 align-items-center justify-content-end h-100 px-5 gradient">
                        <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9 col-lg-auto sw-lg-70">
                            <div className="card shadow-lg">
                                <div className="card-body p-5">
                                    <h1 className="fs-4 card-title fw-bold mb-4">Bienvenido</h1>
                                    <form onSubmit={handleSubmit} className="needs-validation" noValidate={true} autoComplete="off">
                                        <div className="mb-3">
                                            <label className="mb-2 text-muted" htmlFor="email">Usuario</label>
                                            <input id="email" type="text" onChange={handleInputChange} value={datos.usuario} className="form-control" name="usuario" required autoFocus />
                                            <div className="invalid-feedback">
                                                Usuario inválido
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <div className="mb-2 w-100">
                                                <label className="text-muted" htmlFor="password">Contraseña</label>
                                            </div>
                                            <input id="password" type="password" onChange={handleInputChange} value={datos.clave} className="form-control" name="clave" required />
                                            <div className="invalid-feedback">
                                                Contraseña es requirida
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">

                                            <button type="submit" className="btn btn-primary">
                                                <i className="bi bi-box-arrow-in-right"></i> Ingresar
                                            </button>
                                            <div className={user ? "text-center" : "cargando"}>
                                                <div className="spinner-grow text-info" role="status">
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-evenly mt-3'>
                                            <a className='forms_register' onClick={showClientModal}>¿Quieres contratar?</a>
                                            <a className='forms_register' onClick={showWorkerModal}>¿Quieres trabajar?</a>
                                        </div>
                                    </form>
                                </div>
                                <div className="card-footer py-3 border-0">
                                    <div className="text-center">
                                        Todos los derechos reservados &copy; 2022
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <Modal
                style={{
                    top: 20,
                }}
                visible={visibleClientModal}
                title="Crear cliente"
                onCancel={handleCancelClient}
                width="800px"
                footer={[


                ]}
            >

                <Form {...layout} form={formClient} name="crearCliente" className="crearCliente" id="crearCliente" onFinish={handleSubmitClient}>

                    <Row className='d-flex align-items-center justify-content-center foto_perfil'>
                        <Form.Item
                            name="url_recibo_publico"
                            label=""
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            onChange={getUrl}
                            rules={[{ required: true, message: "Este campo es obligatorio" }]}
                        >
                            <Upload name="url_recibo_publico" listType="picture" {...props} maxCount={1} id="url_recibo_publico" accept="application/pdf">
                                <Button icon={<UploadOutlined />}>Recibo de servicio público</Button>
                            </Upload>
                        </Form.Item>
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <MapView setDatosCliente={setDatosCliente} datosCliente={datosCliente} />
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="nombre_cliente" label="Nombre completo" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$" title="Ingresa un nombre válido" onChange={handleInputChangeRegisterClient} name="nombre_cliente" />
                                </Form.Item>
                                <Form.Item name="email_cliente" label="Correo electrónico" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="email" pattern="^[^@]+@[^@]+\.[a-zA-Z]{2,}$" title="Ingresa un correo válido" onChange={handleInputChangeRegisterClient} name="email_cliente" />
                                </Form.Item>

                            </Col>
                            <Col span={12} className="m-3">
                                <Form.Item name="contraseña_cliente" label="Contraseña" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input.Password type="password" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$" title="La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula, al menos una mayúscula y al menos un caracter no alfanumérico." onChange={handleInputChangeRegisterClient} name="contraseña_cliente" />
                                </Form.Item>
                                <Form.Item name="numero_celular_cliente" label="Número de celular" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" pattern="([0-9]{10})" title="Ingresa un número de celular válido" onChange={handleInputChangeRegisterClient} name="numero_celular_cliente" />
                                </Form.Item>

                            </Col>
                        </div>
                    </Row>
                    <div className='d-flex justify-content-center'>
                        <Form.Item >
                            <Button htmlType="button" onClick={onResetClient}>
                                Limpiar
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loadingClient} className="btnCrearCliente">
                                Crear
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <Modal
                style={{
                    top: 20,
                }}
                visible={visibleWorkerModal}
                title="Crear trabajador"
                onCancel={handleCancelWorker}
                width="800px"
                footer={[


                ]}
            >

                <Form {...layout} form={formWorker} name="crearTrabajador" className="crearTrabajador" id="crearTrabajador" onFinish={handleSubmitWorker}>
                    <Row className='d-flex align-items-center justify-content-center foto_perfil'>
                        <Form.Item
                            name="url_foto_perfil"
                            label=""
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            onChange={() => getUrlImg('url_foto_perfil')}
                            rules={[{ required: true, message: "Este campo es obligatorio" }]}
                        >
                            <Upload name="url_foto_perfil" listType="picture" {...props} maxCount={1} id="url_foto_perfil">
                                <Button icon={<UploadOutlined />}>Foto de perfil</Button>
                            </Upload>
                        </Form.Item>
                    </Row>
                    <Row className='d-flex align-items-center justify-content-center foto_perfil'>
                        <Form.Item
                            name="url_documento"
                            label=""
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            onChange={() => getUrlImg('url_documento')}
                            rules={[{ required: true, message: "Este campo es obligatorio" }]}
                        >
                            <Upload name="url_documento" listType="picture" {...props} maxCount={1} id="url_documento" accept="application/pdf">
                                <Button icon={<UploadOutlined />}>Documento de identidad</Button>
                            </Upload>
                        </Form.Item>
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <MapView setDatosTrabajador={setDatosTrabajador} datosTrabajador={datosTrabajador} />
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="nombre_trabajador" label="Nombre completo" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" pattern="^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$" title="Ingresa un nombre válido" onChange={handleInputChangeRegisterEmployee} name="nombre_trabajador" />
                                </Form.Item>
                                <Form.Item name="email_trabajador" label="Correo electrónico" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="mail" pattern="^[^@]+@[^@]+\.[a-zA-Z]{2,}$" title="Ingresa un correo válido" onChange={handleInputChangeRegisterEmployee} name="email_trabajador" />
                                </Form.Item>

                            </Col>
                            <Col span={12} className="m-3">
                                <Form.Item name="contraseña_trabajador" label="Contraseña" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input.Password type="password" pattern="^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$" title="La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula, al menos una mayúscula y al menos un caracter no alfanumérico." onChange={handleInputChangeRegisterEmployee} name="contraseña_trabajador" />
                                </Form.Item>
                                <Form.Item name="numero_celular_trabajador" label="Número de celular" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" pattern="([0-9]{10})" title="Ingresa un número de celular válido" onChange={handleInputChangeRegisterEmployee} name="numero_celular_trabajador" />
                                </Form.Item>

                            </Col>
                        </div>
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <p>Ingresar los precios por hora que tienes para cada una de las labores</p>
                        <p style={{ fontWeight: 'bold' }}>Si no ofreces alguna simplemente no llenas el campo.</p>
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="precio_hora_labor_plomero" label="Plomero" rules={[{ required: false }]} className="d-flex flex-column">
                                    <Input type="text" pattern="([0-9]{5,6})" title="Ingresa un valor monetario válido de 5 a 6 cifras" onChange={handleInputChangeRegisterEmployee} name="precio_hora_labor_plomero" />
                                </Form.Item>
                                <Form.Item name="precio_hora_labor_cerrajero" label="Cerrajero" rules={[{ required: false }]} className="d-flex flex-column">
                                    <Input type="text" pattern="([0-9]{5,6})" title="Ingresa un valor monetario válido de 5 a 6 cifras" onChange={handleInputChangeRegisterEmployee} name="precio_hora_labor_cerrajero" />
                                </Form.Item>

                            </Col>
                            <Col span={12} className="m-3">
                                <Form.Item name="precio_hora_labor_profesor" label="Profesor de inglés" rules={[{ required: false }]} className="d-flex flex-column">
                                    <Input type="text" pattern="([0-9]{5,6})" title="Ingresa un valor monetario válido de 5 a 6 cifras" onChange={handleInputChangeRegisterEmployee} name="precio_hora_labor_profesor" />
                                </Form.Item>
                                <Form.Item name="precio_hora_labor_paseador" label="Paseador de perros" rules={[{ required: false }]} className="d-flex flex-column">
                                    <Input type="text" pattern="([0-9]{5,6})" title="Ingresa un valor monetario válido de 5 a 6 cifras" onChange={handleInputChangeRegisterEmployee} name="precio_hora_labor_paseador" />
                                </Form.Item>

                            </Col>
                        </div>
                    </Row>

                    <div className='d-flex justify-content-center'>
                        <Form.Item >
                            <Button htmlType="button" onClick={onResetWorker}>
                                Limpiar
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loadingWorker} className="btnCrearTrabajador">
                                Crear
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    );
}
LoginView.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default LoginView;
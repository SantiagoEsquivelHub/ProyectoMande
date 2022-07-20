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
import './login.css';


const { Option } = Select;
const { Search } = Input;

const layout = {
    labelCol: { span: 20 },
    wrapperCol: { span: 50 },
};

const LoginView = ({ setToken }) => {

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: '¡Credenciales incorrectas!',
            description:
                'Los datos ingresados son incorrectos. Vefifícalos e inténtalo de nuevo :)',
        });
    };

    const [loading, setLoading] = useState(false);
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
        url_recibo: "",
        email: "",
        numero_celular: "",
        direccion_residencia: ""
    });

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        let newDatos = { ...datos, [name]: value };
        setDatos(newDatos);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            let res = await axios.post("http://localhost:3001/usuario/login", datos);
            setUser(!user);
            setTimeout(() => {
                const accessToken = res.data.token;
                console.log(res.data);
                setToken(accessToken);
                localStorage.setItem("token", accessToken);
                setDatos({
                    usuario: "",
                    clave: ""
                })
            }, 5000);
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

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e.fileList;
        }

        return e.fileList;
    };

    const showClientModal = () => {
        setVisibleClientModal(true);
    };

    const showWorkerModal = () => {
        setVisibleWorkerModal(true);
    };

    const handleCancelClient = () => {
        setVisibleClientModal(false);
    };

    const handleCancelWorker = () => {
        setVisibleWorkerModal(false);
    };

    const onResetClient = () => {
        formClient.resetFields();
    };

    const onResetWorker = () => {
        formWorker.resetFields();
    };

    const handleSubmitClient = () => {

        let position = localStorage.getItem('position')
        console.log(position)

        setDatosCliente({
            ...datosCliente,
            ['direccion_residencia']: position
        })

        console.log(datosCliente);


    }

    const handleSubmitWorker = () => {

    }

    const handleInputChangeRegister = (e) => {

        setDatosCliente({
            ...datosCliente,
            [e.target.name]: e.target.value
        })

    }

    const handleSelectChange = (value) => {

        setDatos({
            ...datos,
            estado_usuario: '1',
            rol_usuario: `${value}`
        })

    };

    const props = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
    }

    const getUrl = async () => {
        const fileInput = document.getElementById('url_recibo');
        const selectedFile = fileInput.files[0];

        const btn = document.getElementsByClassName('btnCrearCliente');

        if (selectedFile.type != "application/pdf") {
            //console.log('LLEGO');
            alert("Solo se permiten imágenes en PDF")
            fileInput.value = "";
            //console.log(btn[0])
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
                            name="url_img_usuario"
                            label=""
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            onChange={getUrl}
                            rules={[{ required: true, message: "Este campo es obligatorio" }]}
                        >
                            <Upload name="url_recibo" listType="picture" {...props} maxCount={1} id="url_recibo" accept="application/pdf">
                                <Button icon={<UploadOutlined />}>Recibo de servicio público</Button>
                            </Upload>
                        </Form.Item>
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <MapView />
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" onChange={handleInputChangeRegister} name="email" />
                                </Form.Item>

                            </Col>
                            <Col span={12} className="m-3">
                                <Form.Item name="numero_celular" label="Número de celular" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" onChange={handleInputChangeRegister} name="numero_celular" />
                                </Form.Item>

                            </Col>
                        </div>
                    </Row>
                    <div className='d-flex justify-content-center'>
                        <Form.Item >
                            <Button htmlType="button" onClick={onResetClient}>
                                Reset
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading} className="btnCrearCliente">
                                Crear
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <Modal
                visible={visibleWorkerModal}
                title="Crear trabajador"
                onCancel={handleCancelWorker}
                width="800px"
                footer={[


                ]}
            >

                <Form {...layout} form={formClient} name="crearTrabajador" className="crearTrabajador" id="crearTrabajador" onFinish={handleSubmitWorker}>
                    <Row className='d-flex align-items-center justify-content-center foto_perfil'>
                        <Form.Item
                            name="url_img_usuario"
                            label=""
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            onChange={getUrl}
                            rules={[{ required: true, message: "Este campo es obligatorio" }]}
                        >
                            <Upload name="url_recibo" listType="picture" {...props} maxCount={1} id="url_recibo" accept="application/pdf">
                                <Button icon={<UploadOutlined />}>Foto de perfil</Button>
                            </Upload>
                        </Form.Item>
                    </Row>
                    <Row className='d-flex align-items-center justify-content-center foto_perfil'>
                        <Form.Item
                            name="url_img_usuario"
                            label=""
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            onChange={getUrl}
                            rules={[{ required: true, message: "Este campo es obligatorio" }]}
                        >
                            <Upload name="url_recibo" listType="picture" {...props} maxCount={1} id="url_recibo" accept="application/pdf">
                                <Button icon={<UploadOutlined />}>Documento de identidad</Button>
                            </Upload>
                        </Form.Item>
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <MapView />
                    </Row>

                    <Row className='col-12 d-flex flex-column align-items-center'>
                        <div className='d-flex justify-content-center'>
                            <Col span={12} className="m-3">
                                <Form.Item name="email" label="Correo electrónico" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" onChange={handleInputChangeRegister} name="email" />
                                </Form.Item>

                            </Col>
                            <Col span={12} className="m-3">
                                <Form.Item name="numero_celular" label="Número de celular" rules={[{ required: true, message: "Este campo es obligatorio" }]} className="d-flex flex-column">
                                    <Input type="text" onChange={handleInputChangeRegister} name="numero_celular" />
                                </Form.Item>

                            </Col>
                        </div>
                    </Row>
                    <div className='d-flex justify-content-center'>
                        <Form.Item >
                            <Button htmlType="button" onClick={onResetWorker}>
                                Reset
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading} className="btnCrearTrabajador">
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
import React, { useState } from 'react'
import { Rate } from 'antd';
import './style.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space, notification } from 'antd';
import { headers } from '../../../containers/headers/headers';
import MapWorkerView from './map';

const { confirm } = Modal;

const CardEmployee = ({ nombre, telefono, estado, url, id, calificacion, precio_hora, distancia, labor }) => {

    /*Estados generales*/
    const [workerInfo, setWorkerInfo] = useState(false);
    const [visibleWatchWorker, setVisibleWatchWorker] = useState(false)
    let direccion_cliente = localStorage.getItem('direccion')

    /*Función para obtener la data de cada usuario*/
    const getWorkers = async (idWorker) => {

        const requestOptions = {
            method: 'GET',
            headers: headers,
        }

        const ruta = `http://${document.domain}:4001/api/worker/info/` + idWorker;

        const res = await fetch(ruta, requestOptions);
        const data = await res.json();

        setWorkerInfo(data[0]);
    }

    /*Función que muestra un modal con la información del trabajador*/
    const openWorker = (e) => {

        let idWorker = e.target.id;

        getWorkers(idWorker);

        setVisibleWatchWorker(true)

    }

    /*Función quecierra un modal con la información del trabajador*/
    const handleCancelWorker = () => {
        setVisibleWatchWorker(false);
    };

    const showConfirm = (e, nombre, precio, labor) => {

        let idTrabajador = e.target.id;
        let idCliente = localStorage.getItem('id');
        let id_labor;
        console.log(idTrabajador, "idTrabajador")
        console.log(idCliente, "idCliente")

        if (labor == 'Plomero') {
            id_labor = '1';
        } else if (labor == 'Profesor de inglés') {
            id_labor = '2';
        } else if (labor == 'Cerrajero') {
            id_labor = '3';
        } else if (labor == 'Paseador de perros') {
            id_labor = '4';
        }

        confirm({
            title: `¿Quieres contratar a ${nombre}?`,
            icon: <ExclamationCircleOutlined />,
            content: `Por $${precio} la hora, por la labor de ${labor}`,
            async onOk() {
                console.log('OK');

                const requestOptions = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        id_cliente: idCliente,
                        id_trabajador: idTrabajador,
                        id_labor: id_labor,
                    })
                }


                const resp = await fetch(`http://${document.domain}:4001/api/hiring/create/`, requestOptions)

                if (resp.status == 200) {
                    openNotificationWithIconSuccess('success');
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);

                } else {
                    openNotificationWithIcon('warning')
                }

            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    /*Función para mostrar notificación cuando no se logre crear la contratacion por algun motivo*/
    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: '¡Contratación sin exito!',
            description:
                'No se pudo contratar al trabajador. Inténtalo de nuevo :)',
        });
    };

    /*Función que muestra una notificación cuando se ha logrado crear un usuario*/
    const openNotificationWithIconSuccess = (type) => {
        notification[type]({
            message: '¡Contratación registrada correctamente!',
            description:
                'El trabajador ha sido informado correctamente :)',
        });
    };

    return (

        <div id={id} className="cardEmployee">

            <li className="ant-list-item"><div className="ant-list-item-meta">
                <div className="ant-list-item-meta-avatar">
                    <span className="ant-avatar ant-avatar-circle ant-avatar-image">
                        <img src={url} />
                    </span>
                </div>
                <div className="ant-list-item-meta-content">
                    <h4 className="ant-list-item-meta-title" >
                        <a onClick={openWorker} id={id}>{nombre}</a>
                    </h4>
                </div>
                <div className="ant-list-item-meta-content">
                    <div className="ant-list-item-meta-description info">{telefono}</div>
                </div>
                <div className="ant-list-item-meta-content">
                    <div className="ant-list-item-meta-description info">{precio_hora}</div>
                </div>
                <div className="ant-list-item-meta-content">
                    <div className="ant-list-item-meta-description info">Está a {Math.round(distancia)} km de tí</div>
                </div>
                <div className="ant-list-item-meta-content">
                    {
                        calificacion == "null" || calificacion == "0" ? <div className="ant-list-item-meta-description info">Sin calificaciones previas</div> : <Rate allowHalf disabled defaultValue={calificacion} />
                    }
                </div>
                <div className="ant-list-item-meta-content">
                    <div className={estado == 'Disponible' ? 'activo ' : 'deshabilitado'}>{estado == 'Disponible' ? estado : 'Ocupado'}</div>
                </div>
                <div className="ant-list-item-meta-content">
                    <div id={id} onClick={(e) => showConfirm(e, nombre, precio_hora, labor)} className={estado == 'Disponible' ? 'contratar' : 'ocupado'}>{estado == 'Disponible' ? 'Contratar' : 'Ocupado'}</div>
                </div>
            </div>

            </li>


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




                {
                    !workerInfo ? 'Cargando...' :
                        <>
                            <div className='d-flex justify-content-center align-items-center imgUser m-2'>
                                <img src={workerInfo.url_foto_perfil} />
                            </div>
                            <table className='tableUser table table-bordered'>
                                <thead>
                                    <tr>
                                        <th scope="col">Campo</th>
                                        <th scope="col">Información</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td>Nombre</td>
                                        <td>{workerInfo.nombre_trabajador}</td>
                                    </tr>
                                    <tr>
                                        <td>Correo</td>
                                        <td>{workerInfo.email_trabajador}</td>
                                    </tr>
                                    <tr>
                                        <td>Celular</td>
                                        <td>{workerInfo.numero_celular_trabajador}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <MapWorkerView
                                direccion_cliente={direccion_cliente}
                                direccion_trabajador={workerInfo.direccion_residencia_trabajador}
                                nombre_trabajador={workerInfo.nombre_trabajador} />
                        </>
                }

            </Modal>
        </div>
    )
}

export default CardEmployee;
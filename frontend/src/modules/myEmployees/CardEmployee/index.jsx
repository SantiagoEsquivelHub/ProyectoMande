import React, { useState } from 'react'
import { Rate } from 'antd';
import './style.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
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
        console.log(ruta);
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

    const showConfirm = (nombre, precio, labor) => {
        confirm({
            title: `¿Quieres contratar a ${nombre}?`,
            icon: <ExclamationCircleOutlined />,
            content: `Por $${precio} la hora, por la labor de ${labor}`,
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
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
                    <div onClick={() => showConfirm(nombre, precio_hora, labor)} className={estado == 'Disponible' ? 'contratar' : 'ocupado'}>{estado == 'Disponible' ? 'Contratar' : 'Ocupado'}</div>
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
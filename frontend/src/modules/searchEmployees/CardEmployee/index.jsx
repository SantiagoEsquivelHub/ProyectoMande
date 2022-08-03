import React, { useState, useEffect } from 'react'
import { Rate } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, notification } from 'antd';
import { headers } from '../../../containers/headers/headers';
import OpenEmployee from '../../../containers/openEmployee';
import { useGetEmployees } from '../../../hooks/useGetEmployees'
import './style.css';

const { confirm } = Modal;

/*Componente usado para mostrar cada uno de los trabajadores segun un filtro previo*/

const CardEmployee = ({ nombre, telefono, estado, url, id, calificacion, precio_hora, distancia, labor }) => {

    /*Estados generales*/
    const [workerInfo, setWorkerInfo] = useState(false);
    const [visibleWatchWorker, setVisibleWatchWorker] = useState(false);
    let id_cliente = localStorage.getItem('id');
    let direccion_cliente = localStorage.getItem('direccion');

    /*Función para obtener la data de cada usuario*/
    const getEmployees = async (idWorker) => {

        const data = await useGetEmployees(idWorker);

        setWorkerInfo(data);
    }

    /*Función que muestra un modal con la información del trabajador*/
    const openEmployee = (e) => {

        let idWorker = e.target.id;

        getEmployees(idWorker);

        setVisibleWatchWorker(true)

    }

    /*Función quecierra un modal con la información del trabajador*/
    const handleCancelWorker = () => {
        setVisibleWatchWorker(false);
    };

    /*Función para contratar un trabajador*/
    const showConfirm = (e, nombre, precio, labor) => {

        let idTrabajador = e.target.id;
        let id_labor;

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

                const requestOptions = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        id_cliente: id_cliente,
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

    /*Función que muestra una notificación cuando se ha logrado crear la contratacion*/
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
                        <a onClick={openEmployee} id={id}>{nombre}</a>
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


        </div>
    )
}

export default CardEmployee;
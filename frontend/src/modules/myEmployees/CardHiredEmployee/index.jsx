import React, { useState, useEffect } from 'react'
import './style.css'
import {
    Button,
    Modal
} from 'antd';
import OpenEmployee from '../../../containers/openEmployee';
import { useGetEmployees } from '../../../hooks/useGetEmployees'
import { headers } from '../../../containers/headers/headers';

const CardHiredEmployee = ({ nombre, precio, labor, estado_contratacion, foto, id }) => {

    /*Estados generales*/
    let direccion_cliente = localStorage.getItem('direccion')
    const [workerInfo, setWorkerInfo] = useState(false);
    const [visibleWatchWorker, setVisibleWatchWorker] = useState(false);
    const [cardsClient, setCardsClient] = useState(false);
    let id_cliente = localStorage.getItem('id');

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

    /*Funciones que se van a ejecutar apenas se renderice la página*/
    useEffect(() => {

        getCardsClient();

    }, [])

    return (
        <>
            <div className="cardHiredEmployee m-3 d-flex justify-content-center align-items-center flex-column">
                <img src={foto} alt="foto_perfil" className='m-2' style={{ width: '150px' }} />
                <p style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={openEmployee} id={id}>{nombre}</p>
                <p>${precio} por hora</p>
                <p>{labor}</p>
                <p className={estado_contratacion == 'Trabajando' ? 'deshabilitado': 'activo'} style={{ width: '170px' }}>{estado_contratacion}</p>

                {
                    !cardsClient ? '' :
                        <Button type="primary" className={estado_contratacion != 'Pendiente de pago' ? 'ocultar' : 'mb-3'}>Pagar</Button>

                }
            </div>


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

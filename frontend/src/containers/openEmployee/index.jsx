import React from 'react'
import MapWorkerView from './map'

const OpenEmployee = ({nombre, correo, celular, direccion_cliente, direccion_trabajador, img}) => {
    return (
        <>
            <div className='d-flex justify-content-center align-items-center imgUser m-2'>
                <img src={img} />
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
                        <td>{nombre}</td>
                    </tr>
                    <tr>
                        <td>Correo</td>
                        <td>{correo}</td>
                    </tr>
                    <tr>
                        <td>Celular</td>
                        <td>{celular}</td>
                    </tr>
                </tbody>
            </table>

            <MapWorkerView
                direccion_cliente={direccion_cliente}
                direccion_trabajador={direccion_trabajador}
                nombre_trabajador={nombre} />
        </>
    )
}

export default OpenEmployee

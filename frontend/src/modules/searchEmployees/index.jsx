import React from 'react'
import '../../containers/style/style.css'
import { useState, useEffect } from 'react';
import { headers } from '../../containers/headers/headers';
import CardEmployee from '../../modules/MyEmployees/CardEmployee'
import {
  Select,
} from 'antd';


const { Option } = Select;

const SearchEmployeesView = () => {

  const [workers, setWorkers] = useState(false);
  const [labor, setLabor] = useState(false);

  const handleChange = async (value) => {

    let id = localStorage.getItem('id')

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        id_labor: value,
        id_cliente: id
      })
    }

    const resp = await fetch(`http://${document.domain}:4001/api/worker/search`, requestOptions)
    const data = await resp.json()
    console.log(data)
    setWorkers(data)
  };

  const getLabors = async () => {

    const requestOptions = {
      method: 'GET',
      headers: headers
    }

    const resp = await fetch(`http://${document.domain}:4001/api/worker/labors`, requestOptions);
    const data = await resp.json();

    setLabor(data)
  }

  useEffect(() => {
    getLabors();

  }, [])


  return (
    <div className='contenedor_main '>

      <h1>Búsqueda de trabajadores</h1>


      <div className='d-flex justify-content-center align-items-center'>
        <Select
          style={{
            width: 200,
          }}
          onChange={handleChange}
        >

          {
            !labor ? 'Cargando...' :
              labor.map(lab => {
                return <Option key={lab.id_labor} value={lab.id_labor}>{lab.nombre_labor}</Option>
              })
          }

        </Select>


      </div>

      <div id='bodyUsers'>
        <ul className='lista'>
          {
            !workers ? '' :
              workers.map(worker => {
                return <CardEmployee 
                key={worker.id_trabajador} 
                nombre={worker.nombre_trabajador} 
                telefono={worker.numero_celular_trabajador} 
                estado={worker.nombre_estado} 
                url={worker.url_foto_perfil} 
                id={worker.id_trabajador} 
                calificacion={worker.calificacion_contratacion} 
                precio_hora={worker.precio_hora_labor} 
                distancia={worker.distancia}
                labor={worker.nombre_labor}
                />
              })

          }

        </ul>
      </div>

    </div>



  )
}

export default SearchEmployeesView
  ;

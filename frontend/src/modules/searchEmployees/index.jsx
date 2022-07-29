import React from 'react'
import '../../containers/style/style.css'
import { Select } from 'antd';
import { useState, useEffect } from 'react';
import { headers } from '../../containers/headers/headers';
import CardEmployee from '../../modules/MyEmployees/CardEmployee'

const { Option } = Select;

const SearchEmployeesView = () => {

  const [labor, setLabor] = useState(false);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const getLabors = async () => {

    const requestOptions = {
      method: 'GET',
      headers: headers
    }

    const resp = await fetch(`http://${document.domain}:4001/api/worker/labors`, requestOptions);
    const data = await resp.json();
    console.log(data)

    setLabor(data)
  }

  useEffect(() => {
    getLabors();

  }, [])


  return (
    <div className='contenedor_main'>

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

        <CardEmployee />
      </div>
    </div>



  )
}

export default SearchEmployeesView
  ;

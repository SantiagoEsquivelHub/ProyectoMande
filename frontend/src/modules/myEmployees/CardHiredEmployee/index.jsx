import React from 'react'

const CardHiredEmployee = ({ nombre, precio, labor, estado_contratacion, foto }) => {
    return (
        <div>
            <img src={foto} alt="" />
            <p>{nombre}</p>
            <p>${precio} por hora</p>
            <p>{labor}</p>
            <p>{estado_contratacion}</p>

        </div>
    )
}

export default CardHiredEmployee;

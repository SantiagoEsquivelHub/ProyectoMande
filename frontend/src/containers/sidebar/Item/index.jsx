import React from 'react'
import { NavLink } from 'react-router-dom';
import './item.scss';

const Item = ({ text, to, svg, open }) => {
  return (
    <div>

      <NavLink className={open ? "linkOpen" : "normal"} to={to}>
        <div>{svg}</div>
        {open ? <p>{text}</p> : null}
      </NavLink>
    </div>
  )
}

export default Item;
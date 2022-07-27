const pool = require("../database/db_pool_connect");

const insertHiring = async (data) => {
    const { id_cliente, id_trabajador, id_labor_trabajador, id_estado_contratacion} = data;

        const createHiring = await pool.query(`INSERT INTO contratacion(id_cliente, id_trabajador, id_labor_trabajador, id_estado_contratacion) VALUES(${id_cliente} , ${id_trabajador} , ${id_labor_trabajador} , ${id_estado_contratacion} );`);

        if (createHiring != '') {
            return true;
        } else{
            return false;
        }

};


module.exports = {
    insertHiring
};
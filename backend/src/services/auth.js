const pool = require("../database/db_pool_connect");
const bcrypt = require('bcryptjs');

const validateUser = async (email, clave) => {
    const password = await clave;
    const cliente = await pool.query(`SELECT contraseña_cliente, email_cliente as email, nombre_cliente as nombre, id_cliente as id, direccion_residencia_cliente as direccion  FROM cliente WHERE email_cliente = '${email}';`);

    if (cliente.rows == '') {
        const trabajador = await pool.query(`SELECT contraseña_trabajador, nombre_trabajador as nombre,  email_trabajador as email, id_trabajador as id, direccion_residencia_trabajador as direccion  FROM trabajador WHERE email_trabajador = '${email}';`);
        if (trabajador.rows != '') {
            const passHashTrabajador = await bcrypt.compare(password, trabajador.rows[0].contraseña_trabajador);

            if (email != trabajador.rows[0].email || !passHashTrabajador) {
                return false;
            } else {
                if (passHashTrabajador || !passHashTrabajador) {
                    delete trabajador.rows[0].contraseña_trabajador;
                }
                return { "rol": "trabajador", ...trabajador.rows[0] };
            }
        } else {
            return false;
        }
    } else {
        const passHashCliente = await bcrypt.compare(password, cliente.rows[0].contraseña_cliente);

        
        if (email != cliente.rows[0].email || !passHashCliente) {
            return false;
        } else {
            if (passHashCliente || !passHashCliente) {
                delete cliente.rows[0].contraseña_cliente;
            }
            return { "rol": "cliente", ...cliente.rows[0] };
        }
    }

};


module.exports = {
    validateUser
};
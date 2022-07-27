const pool = require("../database/db_pool_connect");
const bcrypt = require('bcryptjs');

const insertClient = async (data) => {
    const password = await data.contraseña_cliente;
    const { email_cliente, nombre_cliente , numero_celular_cliente, url_recibo_publico, rol_cliente, direccion_residencia_cliente} = data;
    const passwordHash = await bcrypt.hash(password, 8);

    //let numero_celular_cliente = parseInt(numero_celular_cliente);
    const cliente = await pool.query(`SELECT * FROM cliente WHERE email_cliente = '${email_cliente}';`);

    if (cliente.rows == '') {
        const createClientQuery = await pool.query(`INSERT INTO cliente(email_cliente ,nombre_cliente, contraseña_cliente, numero_celular_cliente, url_recibo_publico, rol_cliente, direccion_residencia_cliente) VALUES('${email_cliente}' , '${nombre_cliente}' , '${passwordHash}', ${numero_celular_cliente}, '${url_recibo_publico}', '${rol_cliente}', '${direccion_residencia_cliente}' );`);

        if (createClientQuery != '') {
            return true;
        }
    } else {
        return false;
    }

};

const deleteClient = async (data) => {
    const { id } = data;

    const eliminarClientQuery = await pool.query(`DELETE FROM cliente WHERE id_cliente = ${id};`);

    if (eliminarClientQuery.rowCount == 1) {
        return true;

    } else {
        return false;
    }

};


module.exports = {
    insertClient,
    deleteClient
};
const pool = require("../database/db_pool_connect");
const bcrypt = require('bcryptjs');

const insertClient = async (data) => {
    const { email, name, password } = data;
    const passwordHash = await bcrypt.hash(password, 8);

    const cliente = await pool.query(`SELECT * FROM cliente WHERE email_cliente = '${email}' AND contraseña_cliente = '${passwordHash}';`);

    if (cliente.rows == '') {
        const createClientQuery = await pool.query(`INSERT INTO cliente(email_cliente ,nombre_cliente, contraseña_cliente) VALUES('${email}' , '${name}' , '${passwordHash}');`);

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
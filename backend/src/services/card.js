const pool = require("../database/db_pool_connect");
const bcrypt = require('bcryptjs');

const insertCard = async (data) => {
    const password = await data.clave_tarjeta;
    const { numero_tarjeta, id_tipo, fecha_caducidad } = data;
    const passwordHash = await bcrypt.hash(password, 8);

    const tarjeta = await pool.query(`SELECT * FROM tarjeta WHERE numero_tarjeta = '${numero_tarjeta}';`);
    console.log(fecha_caducidad, 'fecha_caducidad')
    if (tarjeta.rows == '') {
        const createCard = await pool.query(`INSERT INTO tarjeta(numero_tarjeta, clave_tarjeta, id_tipo, fecha_caducidad) VALUES('${numero_tarjeta}' , '${passwordHash}' , ${id_tipo}, '${fecha_caducidad}');`);

        if (createCard != '') {
            return true;
        }
    } else {
        return false;
    }

};


const getCardTypes = async () => {

    const cardTypes = await pool.query(`SELECT * FROM tipo_tarjeta;`);

    if (cardTypes.rows.length != 0) {
        return cardTypes.rows;
    } else {
        return false;
    }


}

module.exports = {
    insertCard,
    getCardTypes
};
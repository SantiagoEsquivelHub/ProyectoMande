const pool = require("../database/db_pool_connect");
const bcrypt = require('bcryptjs');

const insertCard = async (data) => {
    const password = await data.clave_tarjeta;
    const { numero_tarjeta, id_tipo, fecha_caducidad, id_cliente } = data;
    const passwordHash = await bcrypt.hash(password, 8);

    const tarjeta = await pool.query(`SELECT * FROM tarjeta WHERE numero_tarjeta = '${numero_tarjeta}';`);
   
    if (tarjeta.rows == '') {
        const createCard = await pool.query(`INSERT INTO tarjeta(numero_tarjeta, clave_tarjeta, id_tipo, fecha_caducidad) VALUES('${numero_tarjeta}' , '${passwordHash}' , ${id_tipo}, '${fecha_caducidad}');`);

        if (createCard != '') {

            const searchTarjeta = await pool.query(`SELECT id_tarjeta FROM tarjeta WHERE numero_tarjeta = '${numero_tarjeta}' AND clave_tarjeta = '${passwordHash}' AND id_tipo = ${id_tipo} AND fecha_caducidad = '${fecha_caducidad}'`)
            const id_tarjeta = searchTarjeta.rows[0].id_tarjeta;
            const createCardClient = await pool.query (`INSERT INTO tarjeta_cliente(id_cliente, id_tarjeta) VALUES(${id_cliente}, ${id_tarjeta})`)
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

const getCardsClient = async(id) =>{
    const cardsClient = await pool.query(`SELECT * FROM tarjeta_cliente WHERE id_cliente = ${id};`);

    if (cardsClient.rows.length != 0) {
        return cardsClient.rows;
    } else {
        return false;
    }
}

const getInfoOfCardClient = async(id) =>{

    const cardsClient = await pool.query(`SELECT nombre_tipo,  marca_tipo , banco_tipo , numero_tarjeta FROM tipo_tarjeta as tp
    JOIN  tarjeta AS t ON tp.id_tipo = t.id_tipo
    JOIN  tarjeta_cliente as tc ON t.id_tarjeta = tc.id_tarjeta
    WHERE tc.id_cliente = ${id};`);

    if (cardsClient.rows != '') {
        return cardsClient.rows;
    } else {
        return false;
    }
}

module.exports = {
    insertCard,
    getCardTypes,
    getCardsClient,
    getInfoOfCardClient
};
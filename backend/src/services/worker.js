const pool = require("../database/db_pool_connect");
const bcrypt = require('bcryptjs');

const insertWorker = async (data) => {
    const password = await data.contraseña_trabajador;
    const { nombre_trabajador , direccion_residencia_trabajador ,numero_celular_trabajador , email_trabajador , url_foto_perfil , url_documento , id_estado , rol_trabajador , precio_hora_labor_plomero, precio_hora_labor_profesor, precio_hora_labor_cerrajero, precio_hora_labor_paseador} = data;
    const passwordHash = await bcrypt.hash(password, 8);

    const trabajador = await pool.query(`SELECT * FROM trabajador WHERE email_trabajador = '${email_trabajador}';`);
    if (trabajador.rows == '') {
        const createWorkerQuery = await pool.query(`INSERT INTO trabajador(nombre_trabajador , direccion_residencia_trabajador ,numero_celular_trabajador , email_trabajador , contraseña_trabajador , url_foto_perfil , url_documento , id_estado , rol_trabajador) VALUES('${nombre_trabajador}' , '${direccion_residencia_trabajador}' , ${numero_celular_trabajador}, '${email_trabajador}', '${passwordHash}', '${url_foto_perfil}', '${url_documento}', ${id_estado}, '${rol_trabajador}' );`);
        const id_trabajador = await pool.query(`SELECT id_trabajador FROM trabajador WHERE email_trabajador = '${email_trabajador}';`);

        const verificarLabores = await pool.query(`SELECT * FROM labor_trabajador WHERE id_trabajador = ${id_trabajador.rows[0].id_trabajador};`);

        if (verificarLabores.rows == '') {
            
            const createWorkforceQuery = await pool.query(`INSERT INTO labor_trabajador(precio_hora_labor , id_trabajador ,id_labor) VALUES (${precio_hora_labor_plomero} , ${id_trabajador.rows[0].id_trabajador} , 1) , (${precio_hora_labor_profesor} , ${id_trabajador.rows[0].id_trabajador} , 2) , (${precio_hora_labor_cerrajero} , ${id_trabajador.rows[0].id_trabajador} , 3) , (${precio_hora_labor_paseador} , ${id_trabajador.rows[0].id_trabajador} , 4);`);
            
            if (createWorkerQuery.rows == '' && createWorkforceQuery.rows == '') {
                return true;
            }
        } 
    } else {
        return false;
    }

};

const insertWorkforce = async (data) => {
    const { precio_hora_labor_plomero, precio_hora_labor_profesor, precio_hora_labor_cerrajero, precio_hora_labor_paseador, id_trabajador } = data;

    const verificarLabores = await pool.query(`SELECT * FROM labor_trabajador WHERE id_trabajador = '${id_trabajador}';`);

    if (verificarLabores.rows == '') {
        const createWorkforceQuery = await pool.query(`INSERT INTO labor_trabajador(precio_hora_labor , id_trabajador ,id_labor) VALUES (${precio_hora_labor_plomero} , ${id_trabajador} , 1) , (${precio_hora_labor_profesor} , ${id_trabajador} , 2) , (${precio_hora_labor_cerrajero} , ${id_trabajador} , 3) , (${precio_hora_labor_paseador} , ${id_trabajador} , 4);`);

        if (createWorkforceQuery != '') {
            return true;
        }
    } else {
        return false;
    }

};




module.exports = {
    insertWorker,
    insertWorkforce
};
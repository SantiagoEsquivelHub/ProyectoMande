const pool = require("../database/db_pool_connect");
const bcrypt = require('bcryptjs');

const insertWorker = async (data) => {
    const password = await data.contraseña_trabajador;
    const { nombre_trabajador , direccion_residencia_trabajador ,numero_celular_trabajador , email_trabajador , contraseña_trabajador , url_foto_perfil , url_documento , id_estado , rol_trabajador} = data;
    const passwordHash = await bcrypt.hash(password, 8);

    const trabajador = await pool.query(`SELECT * FROM trabajador WHERE email_trabajador = '${email_trabajador}';`);

    if (trabajador.rows == '') {
        const createWorkerQuery = await pool.query(`INSERT INTO trabajador(nombre_trabajador , direccion_residencia_trabajador ,numero_celular_trabajador , email_trabajador , contraseña_trabajador , url_foto_perfil , url_documento , id_estado , rol_trabajador) VALUES('${nombre_trabajador}' , '${direccion_residencia_trabajador}' , ${numero_celular_trabajador}, '${email_trabajador}', '${passwordHash}', '${url_foto_perfil}', '${url_documento}', ${id_estado}, '${rol_trabajador}' );`);

        if (createWorkerQuery != '') {
            return true;
        }
    } else {
        return false;
    }

};



module.exports = {
    insertWorker
};
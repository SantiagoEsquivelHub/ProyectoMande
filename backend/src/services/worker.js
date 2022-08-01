const pool = require("../database/db_pool_connect");
const bcrypt = require('bcryptjs');

const insertWorker = async (data) => {
    const password = await data.contraseña_trabajador;
    const { nombre_trabajador, direccion_residencia_trabajador, numero_celular_trabajador, email_trabajador, url_foto_perfil, url_documento, rol_trabajador, precio_hora_labor_plomero = null, precio_hora_labor_profesor = null, precio_hora_labor_cerrajero = null, precio_hora_labor_paseador = null } = data;
    const passwordHash = await bcrypt.hash(password, 8);

    const trabajador = await pool.query(`SELECT * FROM trabajador WHERE email_trabajador = '${email_trabajador}';`);
    if (trabajador.rows == '') {
        const createWorkerQuery = await pool.query(`INSERT INTO trabajador(nombre_trabajador , direccion_residencia_trabajador ,numero_celular_trabajador , email_trabajador , contraseña_trabajador , url_foto_perfil , url_documento , id_estado , rol_trabajador) VALUES('${nombre_trabajador}' , '${direccion_residencia_trabajador}' , ${numero_celular_trabajador}, '${email_trabajador}', '${passwordHash}', '${url_foto_perfil}', '${url_documento}', 1, '${rol_trabajador}' );`);
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

const getlabors = async () => {

    const labores = await pool.query(`SELECT * FROM labor;`);

    if (labores.rows != '') {
        return labores.rows;
    } else {
        return false;
    }

};

const resulstOfSearch = async (data) => {

    const { id_cliente, id_labor } = data;
    let latAndLongAllWorker = [];
    let latAndLongAllClient = [];
    let responseData = [];


    /* Consultamos la direccion del cliente */
    const direccionCliente = await pool.query(`SELECT direccion_residencia_cliente FROM cliente WHERE id_cliente = ${id_cliente}`);

    /* Consultamos la direccion del trabajador */
    const direccionesTrabajadores = await pool.query(`SELECT  DISTINCT t.direccion_residencia_trabajador ,  t.id_trabajador FROM trabajador AS t
    JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
    WHERE lt.id_labor = ${id_labor};`);


    /* Validamos si existe el clientem, si no existe retorna error*/
    if (direccionCliente.rows != '') {

        /* Extraemos la latitud y longitud de la direccion de los trabajadores y del cliente */
        direccionesTrabajadores.rows.forEach(element => {
            const lat = element.direccion_residencia_trabajador.split(',')[0].split('(')[1]
            const lon = element.direccion_residencia_trabajador.split(',')[1].split(')')[0]
            latAndLongAllWorker.push({ "lat": `${lat}`, "lon": `${lon}`, "id": `${element.id_trabajador}` });
        });

        direccionCliente.rows.forEach(element => {
            const lat = element.direccion_residencia_cliente.split(',')[0].split('(')[1]
            const lon = element.direccion_residencia_cliente.split(',')[1].split(')')[0]
            latAndLongAllClient.push({ "lat": `${lat}`, "lon": `${lon}` });
        });




        /* Por cada trabajador se valida si ya tuvo alguna contratación para extraer el promedio de las calificaciones de todas las contrataciones, si no tiene se retorna null el valor */
        for (let i = 0; i < latAndLongAllWorker.length; i++) {

            const validarContratacion = await pool.query(`SELECT * FROM contratacion WHERE id_trabajador = ${latAndLongAllWorker[i].id};`);
            if (validarContratacion.rows == '') {
                const distanciaTrabajador = await pool.query(`SELECT l.nombre_labor, haversine(${latAndLongAllClient[0].lat}, ${latAndLongAllClient[0].lon}, ${latAndLongAllWorker[i].lat}, ${latAndLongAllWorker[i].lon}) AS distancia, et.nombre_estado, t.id_trabajador, t.nombre_trabajador, t.numero_celular_trabajador, t.url_foto_perfil, t.url_foto_perfil, lt.precio_hora_labor FROM trabajador AS t
                JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
                JOIN estado_trabajador AS et ON t.id_estado = et.id_estado
                JOIN labor AS l ON l.id_labor = lt.id_labor
                WHERE lt.id_labor = ${id_labor} AND t.id_trabajador = ${latAndLongAllWorker[i].id}
                ORDER BY distancia DESC, lt.precio_hora_labor ASC`);

                const resultadoConCalificacion = { "calificacion_contratacion": "null", ...distanciaTrabajador.rows[0] }
                responseData.push(resultadoConCalificacion);
            } else {
                const distanciaTrabajador = await pool.query(`SELECT l.nombre_labor, haversine(${latAndLongAllClient[0].lat}, ${latAndLongAllClient[0].lon}, ${latAndLongAllWorker[i].lat}, ${latAndLongAllWorker[i].lon}) AS distancia, t.direccion_residencia_trabajador, t.numero_celular_trabajador, et.nombre_estado ,t.id_trabajador, t.nombre_trabajador, t.numero_celular_trabajador, t.url_foto_perfil , lt.precio_hora_labor FROM trabajador AS t
                JOIN contratacion AS c ON t.id_trabajador = c.id_trabajador
                JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
                JOIN estado_trabajador AS et ON t.id_estado = et.id_estado
                JOIN labor AS l ON l.id_labor = lt.id_labor
                WHERE lt.id_labor = ${id_labor} AND t.id_trabajador = ${latAndLongAllWorker[i].id}
                ORDER BY distancia DESC, lt.precio_hora_labor ASC`);

                const calificacionTrabajadorAVG = await pool.query(`SELECT AVG(c.calificacion_contratacion) FROM trabajador AS t
                JOIN contratacion AS c ON t.id_trabajador = c.id_trabajador
                JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
                WHERE lt.id_labor = ${id_labor} AND t.id_trabajador = ${latAndLongAllWorker[i].id}`);


                const resultadoConCalificacion = { "calificacion_contratacion": `${calificacionTrabajadorAVG.rows[0].avg}`, ...distanciaTrabajador.rows[0] }
                responseData.push(resultadoConCalificacion);
            }

        }
    }


    if (direccionCliente.rows != '') {
        return responseData;
    } else {
        return false;
    }

};

const getInfo = async (id) => {
    const trabajador = await pool.query(`SELECT * FROM trabajador WHERE id_trabajador = ${id};`);

    if (trabajador.rows != '') {
        return trabajador.rows;
    } else {
        return false;
    }
}


module.exports = {
    insertWorker,
    insertWorkforce,
    getlabors,
    resulstOfSearch,
    getInfo
};
const pool = require("../database/db_pool_connect");
const bcrypt = require('bcryptjs');

const insertWorker = async (data) => {
    const password = await data.contraseña_trabajador;
    const { nombre_trabajador, direccion_residencia_trabajador, numero_celular_trabajador, email_trabajador, url_foto_perfil, url_documento, rol_trabajador, precio_hora_labor_plomero, precio_hora_labor_profesor, precio_hora_labor_cerrajero, precio_hora_labor_paseador } = data;
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
    /* Consultamos la direccion del cliente */
    const direccionCliente = await pool.query(`SELECT direccion_residencia_cliente FROM cliente WHERE id_cliente = ${id_cliente}`);
    //console.log(direccionCliente)

    /* Consultamos la direccion del trabajador */
    const direccionesTrabajadores = await pool.query(`SELECT  DISTINCT t.direccion_residencia_trabajador ,  t.id_trabajador FROM trabajador AS t
    JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
    WHERE lt.id_labor = ${id_labor};`);
    //console.log(direccionesTrabajadores.rows)


    let latAndLongAll = [];

    direccionesTrabajadores.rows.forEach(element => {
        //console.log(element.direccion_residencia_trabajador) //coord
        const lat = element.direccion_residencia_trabajador.split(',')[0].split('(')[1]
        const lon = element.direccion_residencia_trabajador.split(',')[1].split(')')[0]
        //let latAndLongAll = [...latAndLongAll , {"lat": "", "long": ""}]
        latAndLongAll.push({ "lat": `${lat}`, "lon": `${lon}`, "id": `${element.id_trabajador}` });
    });
    //console.log(latAndLongAll)
    var responseData = [];


    for (let i = 0; i < latAndLongAll.length; i++) {
        const validarContratacion = await pool.query(`SELECT * FROM contratacion WHERE id_trabajador = ${latAndLongAll[i].id};`);
        //console.log(validarContratacion.rows)
        if(validarContratacion.rows == ''){
            //console.log("entre")
            const distanciaTrabajador1 = await pool.query(`SELECT haversine(3.4532498,-76.5141266, ${latAndLongAll[i].lat}, ${latAndLongAll[i].lon}) AS distancia, et.nombre_estado, t.id_trabajador, t.nombre_trabajador, t.numero_celular_trabajador, t.url_foto_perfil, t.url_foto_perfil, lt.precio_hora_labor FROM trabajador AS t
            JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
            JOIN estado_trabajador AS et ON t.id_estado = et.id_estado
            WHERE lt.id_labor = ${id_labor} AND t.id_trabajador = ${latAndLongAll[i].id}
            ORDER BY lt.precio_hora_labor ASC, distancia DESC`);
            //console.log(distanciaTrabajador1.rows , "A")
            const agregarCalificacion = {"calificacion_contratacion": "null", ...distanciaTrabajador1.rows[0]}
            responseData.push(agregarCalificacion);
        }else{
            //console.log("entre2")
            const distanciaTrabajador2 =  await pool.query(`SELECT DISTINCT haversine(3.4532498,-76.5141266, ${latAndLongAll[i].lat}, ${latAndLongAll[i].lon}) AS distancia, et.nombre_estado ,t.id_trabajador, t.nombre_trabajador, t.numero_celular_trabajador, t.url_foto_perfil , lt.precio_hora_labor FROM trabajador AS t
            JOIN contratacion AS c ON t.id_trabajador = c.id_trabajador
            JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
            JOIN estado_trabajador AS et ON t.id_estado = et.id_estado
            WHERE lt.id_labor = ${id_labor} AND t.id_trabajador = ${latAndLongAll[i].id}
            ORDER BY lt.precio_hora_labor ASC, distancia DESC`);
            const calificacionTrabajadorAVG = await pool.query(`SELECT AVG(c.calificacion_contratacion) FROM trabajador AS t
            JOIN contratacion AS c ON t.id_trabajador = c.id_trabajador
            JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
            WHERE lt.id_labor = ${id_labor} AND t.id_trabajador = ${latAndLongAll[i].id}`);
            //console.log(calificacionTrabajadorAVG.rows[0].avg)
            //console.log(calificacionTrabajadorAVG.rows[0].avg , "asdas")
            const agregarCalificacion = {"calificacion_contratacion": `${calificacionTrabajadorAVG.rows[0].avg}`, ...distanciaTrabajador2.rows[0]}
            //console.log(agregarCalificacion)
            responseData.push(agregarCalificacion);
            //console.log(responseData)
        }
        
    }




    // //console.log(latAndLongAll)
    // latAndLongAll.map(async element => {
    //     //console.log(element.lat, element.lon , element.id ,"holaaa")
    //     const validarContratacion = await pool.query(`SELECT * FROM contratacion WHERE id_trabajador = ${element.id};`);
    //     console.log(validarContratacion.rows)
    //     if( validarContratacion.rows == ""){
    //         const distanciaTrabajador =  await pool.query(`SELECT DISTINCT haversine(3.4532498,-76.5141266, ${element.lat}, ${element.lon}) AS distancia,t.id_trabajador, t.nombre_trabajador, t.numero_celular_trabajador, lt.precio_hora_labor FROM trabajador AS t
    //         JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
    //         WHERE lt.id_labor = ${id_labor} AND t.id_trabajador = ${element.id}
    //         ORDER BY lt.precio_hora_labor ASC, distancia DESC`);
    //     }else{
    //         const distanciaTrabajador =  await pool.query(`SELECT DISTINCT haversine(3.4532498,-76.5141266, ${element.lat}, ${element.lon}) AS distancia,t.id_trabajador, t.nombre_trabajador, t.numero_celular_trabajador, lt.precio_hora_labor, c.calificacion_contratacion FROM trabajador AS t
    //         JOIN contratacion AS c ON t.id_trabajador = c.id_trabajador
    //         JOIN labor_trabajador AS lt ON t.id_trabajador = lt.id_trabajador
    //         WHERE lt.id_labor = ${id_labor} AND t.id_trabajador = ${element.id}
    //         ORDER BY c.calificacion_contratacion DESC, lt.precio_hora_labor ASC, distancia DESC`);
    //     }


    //     console.log(distanciaTrabajador.rows)
    // })


    // console.log(coord.split(',')[0].split('(')[1])//lat
    // console.log(coord.split(',')[1].split(')')[0])//lng

    if (direccionCliente.rows != '') {
        return responseData;
    } else {
        return false;
    }

};




module.exports = {
    insertWorker,
    insertWorkforce,
    getlabors,
    resulstOfSearch
};
const pool = require("../database/db_pool_connect");
const { get } = require("../routes/hiring");

const hireWorker = async (data) => {
    const { id_cliente, id_trabajador, id_labor_trabajador, id_estado_contratacion = 1, calificacion_contratacion = null } = data;

    const createHiring = await pool.query(`INSERT INTO contratacion(id_cliente, id_trabajador, id_labor_trabajador, id_estado_contratacion , calificacion_contratacion) VALUES(${id_cliente} , ${id_trabajador} , ${id_labor_trabajador} , ${id_estado_contratacion}, ${calificacion_contratacion} );`);
    const actualizarEstadoTrabajador = await pool.query(`UPDATE trabajador
    SET id_estado = 2
    WHERE id_trabajador = ${id_trabajador};`);

    if (createHiring != '') {
        return true;
    } else {
        return false;
    }

};

const viewHiring = async (data) => {
    const { id, tipo} = data;
    console.log(tipo)
    if(tipo == "id_cliente"){
        let get = await pool.query(`SELECT t.nombre_trabajador, l.nombre_labor , lt.precio_hora_labor , ec.nombre_estado_contratacion
        FROM contratacion AS c
        JOIN estado_contratacion AS ec ON c.id_estado_contratacion = ec.id_estado_contratacion
        JOIN labor_trabajador AS lt ON c.id_labor_trabajador = lt.id_labor_trabajador
        JOIN labor AS l ON lt.id_labor = l.id_labor
        JOIN trabajador AS t ON c.id_trabajador = t.id_trabajador
        JOIN cliente AS cl ON c.id_cliente = cl.id_cliente
        WHERE cl.id_cliente = ${id}
        ORDER BY c.id_estado_contratacion ASC;`);
        if (get != '') {
            return get.rows;
        } else {
            return false;
        }
    
    }else if(tipo == "id_trabajador"){
        let get = await pool.query(`SELECT cl.nombre_cliente, l.nombre_labor , lt.precio_hora_labor , ec.nombre_estado_contratacion
        FROM contratacion AS c
        JOIN estado_contratacion AS ec ON c.id_estado_contratacion = ec.id_estado_contratacion
        JOIN labor_trabajador AS lt ON c.id_labor_trabajador = lt.id_labor_trabajador
        JOIN labor AS l ON lt.id_labor = l.id_labor
        JOIN trabajador AS t ON c.id_trabajador = t.id_trabajador
        JOIN cliente AS cl ON c.id_cliente = cl.id_cliente
        WHERE t.id_trabajador = ${id}
        ORDER BY c.id_estado_contratacion ASC;`);
        if (get != '') {
            return get.rows;
        } else {
            return false;
        }
    
    }else{
        return false;
    }
    
    
};



module.exports = {
    hireWorker,
    viewHiring
};
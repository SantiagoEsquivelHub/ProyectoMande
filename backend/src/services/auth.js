const pool = require("../database/db_pool_connect");

const validateUser = async ( email , clave) => {

    const cliente = await pool.query(`SELECT email_cliente as email, nombre_cliente as nombre, id_cliente as id  FROM cliente WHERE email_cliente = '${email}' AND contraseña_cliente = '${clave}';`);
    if(cliente.rows == ''){
        const trabajador = await pool.query(`SELECT nombre_trabajador as nombre,  email_trabajador as email, id_trabajador as id  FROM trabajador WHERE email_trabajador = '${email}' AND contraseña_trabajador = '${clave}';`);
        if(trabajador.rows != ''){
            if(email != trabajador.rows[0].email ){
                return false;
            } else{
                return {"rol": "trabajador", ...trabajador.rows[0]};
            }
        }else{
            return false;
        }

    }else{
        if(email != cliente.rows[0].email ){
            return false;
        } else{
            return {"rol": "cliente", ...cliente.rows[0]};
        }
    }
};

const getUser = (req , res ) => {
    const usuario = req.body.usuario;
}


module.exports = {
    validateUser,
};
const pool = require("../database/db_pool_connect");

const validateUser = async ( usuario ) => {

    const user = await pool.query("SELECT correo_usuario , documento_usuario , id_usuario FROM usuario WHERE correo_usuario = $1;", [usuario]);
  
    if(user.rows == ''){
        return false;
    }else{
        if(usuario != user.rows[0].correo_usuario ){
            return false;
            
        } else{
            return user.rows[0];
        }
    
    }
};

const getUser = (req , res ) => {
    const usuario = req.body.usuario;
}


module.exports = {
    validateUser,
};
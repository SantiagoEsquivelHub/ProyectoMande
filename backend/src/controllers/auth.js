const { response } = require('express');
const { validateUser } = require( '../services/auth')
const jwt = require("jsonwebtoken");
const TOKEN_KEY = "x4TvnErxRETbVcqaLl5dqMI115eNlp5y";

const login = async (req, res = response) => {
    //console.log(req.body)
    const email = req.body.usuario;
    const clave = req.body.clave;

    const validateUserExist = await validateUser(email , clave);
    console.log(validateUserExist)
    if(validateUserExist){
        /* Creamos el token unico */
        const token = jwt.sign(
            { userId: validateUserExist.id_usuario, email: validateUserExist.correo_usuario },
            TOKEN_KEY,
            { expiresIn: "2h" }
        );

        //Traemos la información del usuario cuando ya se confirma la autenticación
        let data = { token, ...validateUserExist};

        res.status(200).json(data);
    }else{
        res.status(400).send("Usuario no existe");
    }
    
};

module.exports = {
    login
}

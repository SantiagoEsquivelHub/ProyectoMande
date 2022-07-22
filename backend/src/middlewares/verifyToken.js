const jwt = require("jsonwebtoken");

const TOKEN_KEY = "x4TvnErxRETbVcqaLl5dqMI115eNlp5y";

const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(authHeader);

    if (token == null)
        return res.status(401).send("Token requerido");

    jwt.verify(token, TOKEN_KEY, (err, user) => {
        if (err) return res.status(403).send("Token invalido");

        console.log(user);
        req.user = user;

        next();
    });

}

module.exports = {
    verifyToken
}

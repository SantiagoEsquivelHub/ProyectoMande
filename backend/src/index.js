const express = require("express");
const  auth  = require('./routes/auth')
const  client  = require('./routes/client')

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.use("/api/auth/", auth);

app.use("/api/client/", client);

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado el puerto ${PORT}`);
});

const express = require("express");
const  auth  = require('./routes/auth')
const  client  = require('./routes/client')
const  worker  = require('./routes/worker')


const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.use("/api/auth/", auth);

app.use("/api/client/", client);

app.use("/api/worker/", worker);

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado el puerto ${PORT}`);
});

const express = require("express");
const auth = require('./routes/auth')
const client = require('./routes/client')
const worker = require('./routes/worker')
const cors = require("cors");
let bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use(cors());

app.use("/api/auth/", auth);

app.use("/api/client/", client);

app.use("/api/worker/", worker);

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado el puerto ${PORT}`);
});

const express = require("express");
const conectarDB = require("./config/db");
const cors = require('cors');

//crear el servidor
const app = express();

//Conectar a la BD
conectarDB();

//hablitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({ extended: true }));

//Puerto de la APP
const port = process.env.PORT || 4000;

//importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));


//Definir pagina principal
app.get("/", (req, res) => {
  res.send("Test Api");
});

//Arranca la app
app.listen(port,'0.0.0.0', () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`);
});

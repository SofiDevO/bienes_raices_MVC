import express from 'express';
import usuarioRoutes from './routes/usarioRoutes.js';

const app = express();

// enable Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Public folder
app.use(express.static('public'));

// Routing
app.use("/auth", usuarioRoutes);


// definir puerto
const port = 3000;
app.listen(port , () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
})
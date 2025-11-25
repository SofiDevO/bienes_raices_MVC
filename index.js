import express from 'express';
import usuarioRoutes from './routes/usarioRoutes.js';
import db from './config/db.js';
import chalk from 'chalk';

// create app
const app = express();

// app.use(express.json());
// enable reading form data
app.use(express.urlencoded({extended: true}));


// conect to db
try {
  await db.authenticate();
  db.sync();
  console.log(chalk.green('Database connected on port 🚀: 3307'));

} catch (error) {
  console.log(chalk.red('Error DB'), error);
}

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
  console.log(chalk.magentaBright.bgBlack(`Servidor corriendo en http://localhost:${port}`));
});
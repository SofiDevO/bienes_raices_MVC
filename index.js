import express from 'express';
import cookieParser from 'cookie-parser';
import { doubleCsrfProtection } from './config/csrf.js';
import usuarioRoutes from './routes/userRouter.js';
import db from './config/db.js';
import chalk from 'chalk';
// create app
const app = express();

// app.use(express.json());

// enable reading form data
app.use(express.urlencoded({extended: true}));

// enable cookie parser
app.use(cookieParser());

// enable CSRF
app.use(doubleCsrfProtection);


// conect to db
try {
  await db.authenticate();
  db.sync();
  console.log(chalk.green('Database connected 🚀'));

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
const port = process.env.PORT || 3000;
app.listen(port , () => {
  console.log(chalk.magentaBright.bgBlack(`Servidor corriendo en http://localhost:${port}`));
});
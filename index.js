import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import db from './config/db.js';
import { csrfMidelware, verifyCsrfToken } from './midelwares/csrfMidelware.js';
import usuarioRoutes from './routes/userRouter.js';

// Load environment variables
dotenv.config();

// create app
const app = express();

// app.use(express.json());

// enable reading form data
app.use(express.urlencoded({extended: true}));

// enable cookie parser
app.use(cookieParser());

// enable CSRF middleware
app.use(csrfMidelware);
app.use(verifyCsrfToken);


// conect to db
try {
  await db.authenticate();
  db.sync();
  console.log(chalk.green(`Database connected 🚀 in port ${process.env.DB_HOST}:${process.env.DB_PORT}`));

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
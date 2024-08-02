import express from 'express';
import { doubleCsrf } from 'csrf-csrf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie Parser
app.use(cookieParser());

// Habilitar CSRF
const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'default_secret',
  cookieName: 'XSRF-TOKEN',
  cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === 'production' },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

// Aplicar CSRF protection a las rutas necesarias
app.use(doubleCsrfProtection);


// Conexión a Base de datos
const connectToDatabase = async () => {
  try {
    await db.authenticate();
    await db.sync();
    console.log('Conexión correcta a base de datos 🚀');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Salir del proceso con un código de error
  }
};

// Inicializar la conexión a la base de datos y arrancar el servidor
const startServer = async () => {
  await connectToDatabase();

  // Habilitar Pug
  app.set('view engine', 'pug');
  app.set('views', './views');

  // Carpeta Publica
  app.use(express.static('public'));

  // Routing
  app.use('/auth', usuarioRoutes);

  // Definir un puerto y arrancar proyecto
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${port} 💜`);
  });
};

// Llamar a la función para iniciar el servidor
startServer();

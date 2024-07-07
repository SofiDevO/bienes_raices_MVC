// Importamos Sequelize para interactuar con la base de datos
import { Sequelize } from "sequelize";
// Importamos dotenv para gestionar variables de entorno
import dotenv from "dotenv";

// Cargamos las variables de entorno desde el archivo .env
dotenv.config({ path: ".env" });

// Configuramos una nueva instancia de Sequelize para conectarnos a la base de datos
const db = new Sequelize(
  process.env.DB_NOMBRE, // Nombre de la base de datos
  process.env.DB_USER, // Usuario de la base de datos
  process.env.DB_PASSWORD ?? '', // Contraseña de la base de datos (usa una cadena vacía si no está definida)
  {
    host: 'localhost', // Servidor de la base de datos
    port: 3366, // Puerto en el que está corriendo el servidor de base de datos
    dialect: 'mysql', // Dialecto de SQL que estamos utilizando (en este caso, MySQL)
    define: {
      timestamps: true // Agrega automáticamente los campos createdAt y updatedAt a las tablas
    },
    pool: {
      max: 5, // Número máximo de conexiones en el pool
      min: 0, // Número mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo, en milisegundos, que se intentará adquirir una conexión antes de lanzar un error
      idle: 10000 // Tiempo máximo, en milisegundos, que una conexión puede estar inactiva antes de ser liberada
    },
    operatorsAliases: 0 // Deshabilita los alias de operadores de Sequelize (por razones de seguridad)
  }
);

// Exportamos la instancia de Sequelize para poder utilizarla en otras partes de la aplicación
export default db;

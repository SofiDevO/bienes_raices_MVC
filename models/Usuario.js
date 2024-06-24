// Importamos DataTypes desde Sequelize para definir los tipos de datos de nuestro modelo
import { DataTypes } from "sequelize";

// Importamos la configuración de la base de datos desde el archivo de configuración
import db from '../config/db.js';

// Importamos bcrypt para hashear las contraseñas
import bcrypt from "bcrypt";

// Definimos el modelo Usuario con Sequelize
const Usuario = db.define('usuarios', {
    // Definición del campo nombre
    nombre:{
        type: DataTypes.STRING, // Tipo de dato STRING
        allowNull: false // No permite valores nulos
    },
    // Definición del campo email
    email:{
        type: DataTypes.STRING, // Tipo de dato STRING
        allowNull: false // No permite valores nulos
    },
    // Definición del campo password
    password:{
        type: DataTypes.STRING, // Tipo de dato STRING
        allowNull: false // No permite valores nulos
    },
    // Definición del campo token
    token: DataTypes.STRING, // Tipo de dato STRING, permite valores nulos por defecto
    // Definición del campo confirmado
    confirmado: DataTypes.BOOLEAN // Tipo de dato BOOLEAN, permite valores nulos por defecto
}, {
    hooks: {
        // Hook que se ejecuta antes de crear un usuario
        beforeCreate: async function(usuario){
            // Generar un salt para hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            // Hashear la contraseña del usuario
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
});

// Exportamos el modelo Usuario para usarlo en otras partes de la aplicación
export default Usuario;

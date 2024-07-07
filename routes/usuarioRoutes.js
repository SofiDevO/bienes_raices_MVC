// Importamos express
import express from "express";

// Importamos los controladores desde el archivo correspondiente
import { formularioLogin, formularioRegistro, registrar, confirmar, formularioRecuperarPassword } from "../controllers/usuarioController.js";

// Creamos una instancia de Router
const router = express.Router();

// Ruta para mostrar el formulario de login
router.get("/login", formularioLogin);

// Ruta para mostrar el formulario de registro
router.get("/register", formularioRegistro);

// Ruta para manejar el envío del formulario de registro
router.post("/register", registrar);

// Ruta para confirmar la cuenta usando un token
router.get('/confirmar/:token', confirmar);

// Ruta para mostrar el formulario de recuperación de contraseña
router.get("/olvide-password", formularioRecuperarPassword);

// Exportamos el router para usarlo en otras partes de la aplicación
export default router;

// Importamos funciones de express-validator para realizar validaciones en los datos del formulario
import { check, validationResult } from "express-validator";
import { generateId } from "../helpers/tokens.js";
// Importamos el modelo Usuario desde el archivo correspondiente
import Usuario from "../models/Usuario.js";
import {registerEmail} from "../helpers/emails.js";
// Controlador para mostrar el formulario de login
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión", // Título de la página
  });
};

// Controlador para mostrar el formulario de registro
const formularioRegistro = (req, res) => {
  res.render("auth/register", {
    pagina: "Crear Cuenta", // Título de la página
  });
};

// Controlador para manejar el registro de un nuevo usuario
const registrar = async (req, res) => {
  // Validación de los campos del formulario
  await check("nombre")
    .notEmpty() // Verifica que el campo no esté vacío
    .withMessage("El nombre es requerido") // Mensaje de error si está vacío
    .run(req); // Ejecuta la validación
  await check("email")
    .notEmpty() // Verifica que el campo no esté vacío
    .withMessage("El email es requerido") // Mensaje de error si está vacío
    .isEmail() // Verifica que el valor sea un email válido
    .withMessage("El email no es válido") // Mensaje de error si no es un email válido
    .run(req); // Ejecuta la validación
  await check("password")
    .isLength({ min: 6 }) // Verifica que el password tenga al menos 6 caracteres
    .withMessage("El password debe ser de al menos 6 caracteres") // Mensaje de error si es muy corto
    .run(req); // Ejecuta la validación
  await check("repetir_password")
    .equals(req.body.password) // Verifica que repetir_password coincida con password
    .withMessage("Las contraseñas no son iguales") // Mensaje de error si no coinciden
    .run(req); // Ejecuta la validación

  // Verificar si hay errores en las validaciones
  let resultado = validationResult(req);

  // Si hay errores, renderizamos el formulario con los errores
  if (!resultado.isEmpty()) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      errores: resultado.array(), // Array de errores de validación
      usuario: {
        nombre: req.body.nombre, // Retenemos el nombre ingresado
        email: req.body.email, // Retenemos el email ingresado
      },
    });
  }

  // Extraer los datos del formulario
  const { nombre, email, password } = req.body;

  // Verificar que el usuario no esté duplicado
  const existeUsuario = await Usuario.findOne({ where: { email } });
  if (existeUsuario) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "El usuario ya está registrado" }], // Mensaje de error si el usuario ya existe
      usuario: {
        nombre: req.body.nombre, // Retenemos el nombre ingresado
        email: req.body.email, // Retenemos el email ingresado
      },
    });
  }

  // Almacenar un nuevo usuario en la base de datos
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generateId(), // Generar y asignar un token de verificación (en un caso real, debería ser generado dinámicamente)
  });

// Envia email de confirmación
registerEmail({
  nombre: usuario.nombre,
  email:usuario.email,
  token: usuario.token
});


  //Mostrar mensaje de confirmación
  res.render('templates/mensaje',{
    pagina:"Cuenta creada correctamente",
    mensaje:"Hemos enviado un email de confirmación, presiona en  el enlace."
  })
};
// Función para comprobar cuenta
const confirmar = (req, res, next ) =>{
  const {token } = req.params;
  console.log(token)
  // Verificar si el token es válido

  // confirmar cuenta
  next();
}

// Controlador para mostrar el formulario de recuperación de contraseña
const formularioRecuperarPassword = (req, res) => {
  res.render("auth/forgot-password", {
    pagina: "Recuperar contraseña", // Título de la página
  });
};

// Exportamos los controladores para usarlos en otras partes de la aplicación
export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioRecuperarPassword,
};

import { check, validationResult } from "express-validator";
import { generateId } from "../helpers/tokens.js";
import Usuario from "../models/Usuario.js";
import { registerEmail, forgotPassword } from "../helpers/emails.js";
// Controlador para mostrar el formulario de login
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

// Controlador para mostrar el formulario de registro
const formularioRegistro = (req, res) => {
  res.render("auth/register", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

// Controlador para manejar el registro de un nuevo usuario
const registrar = async (req, res) => {
  //  validacion
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .trim()
    .run(req);

  await check("email")
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("El email no es válido")
    .normalizeEmail()
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .trim()
    .run(req);
  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Las contraseñas no son iguales")
    .run(req);

  let resultado = validationResult(req);

  // Verificar que el resultado esté vacío
  if (!resultado.isEmpty()) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  try {
    const { nombre, email, password } = req.body;
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
      return res.render("auth/register", {
        pagina: "Crear Cuenta",
        errores: [{ msg: "El usuario ya está registrado" }],
        usuario: {
          nombre: req.body.nombre,
          email: req.body.email,
        },
      });
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      token: generateId(),
    });

    await registerEmail({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });

    res.render("templates/mensaje", {
      pagina: "Cuenta creada correctamente",
      mensaje: "Hemos enviado un email de confirmación, presiona en el enlace.",
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.render("auth/register", {
      pagina: "Crear Cuenta",
      errores: [
        { msg: "Hubo un error al registrar el usuario, intenta de nuevo." },
      ],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
};

// Función para confirmar cuenta
const confirmar = async (req, res, next) => {
  const { token } = req.params;
  try {
    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario) {
      return res.render("auth/confirmar-cuenta", {
        pagina: "Error al confirmar tu cuenta",
        mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo.",
        error: true,
      });
    }

    // Confirmar cuenta

    next();
  } catch (error) {
    console.error("Error al confirmar cuenta:", error);
    res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo.",
      error: true,
    });
  }
};

// Controlador para mostrar el formulario de recuperación de contraseña
const formularioRecuperarPassword = (req, res) => {
  res.render("auth/forgot-password", {
    pagina: "Recuperar contraseña",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("El email no es válido").run(req);

  let resultado = validationResult(req);

  // Verificar que el resultado esté vacío
  if (!resultado.isEmpty()) {
    return res.render("auth/forgot-password", {
      pagina: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  // Buscar al usuario
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/forgot-password", {
      pagina: "El email no es váliddo",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El email no está registrado en la plataforma" }],
    });
  }

  // Generar un token y enviar el email
  usuario.token = generateId();
  await usuario.save();

  //  Enviar Email
  forgotPassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token
  })

  // renderizar mensaje
  res.render("templates/mensaje", {
    pagina: "Restablece tu password",
    mensaje: "Hemos enviado un email con las instrucciones",
  });
};

const comprobarToken = (req, res, next) => {
  next();
};

const newPassword = (req, res, next) => {
  next();
};

export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioRecuperarPassword,
  resetPassword,
  comprobarToken,
  newPassword,
};

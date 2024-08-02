import { check, validationResult } from "express-validator";
import { generateId } from "../helpers/tokens.js";
import Usuario from "../models/Usuario.js";
import { registerEmail } from "../helpers/emails.js";

// Controlador para mostrar el formulario de login
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
    csrfToken: req.csrfToken(), // Include CSRF token
  });
};

// Controlador para mostrar el formulario de registro
const formularioRegistro = (req, res) => {
  res.render("auth/register", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(), // Include CSRF token
  });
};

// Controlador para manejar el registro de un nuevo usuario
const registrar = async (req, res) => {
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

  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
      csrfToken: req.csrfToken(), // Include CSRF token
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
        csrfToken: req.csrfToken(), // Include CSRF token
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
      errores: [{ msg: "Hubo un error al registrar el usuario, intenta de nuevo." }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
      csrfToken: req.csrfToken(), // Include CSRF token
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

    // Confirmar cuenta (consider adding actual account confirmation logic)
    // e.g., usuario.confirmado = true; await usuario.save();
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
    csrfToken: req.csrfToken(), // Include CSRF token
  });
};

export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioRecuperarPassword,
};

import { check, validationResult } from "express-validator";
import { generateId } from "../helpers/tokens.js";
import User from "../models/Usuario.js";

import { registerEmail, resetPasswordEmail } from "../helpers/emails.js";

const registerForm = (req, res) => {
  res.render("auth/register", {
    page: "Crear Cuenta",
    csrfToken: res.locals.csrfToken,
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // validation
  await check("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe tener al menos 6 caracteres")
    .run(req);
  // Validate password confirmation
  await check("repit_password")
    .equals(password)
    .withMessage("Los passwords no son iguales")
    .run(req);

  // validation result
  let result = validationResult(req);

  // Verified if result is empty
  if (!result.isEmpty()) {
    return res.render("auth/register", {
      page: "Crear Cuenta",
      csrfToken: res.locals.csrfToken,
      errors: result.array(),
      user: {
        name,
        email,
      },
    });
  }
  // Check if user is already registered
  const userExist = await User.findOne({ where: { email } });
  if (userExist) {
    return res.render("auth/register", {
      page: "Crear Cuenta",
      csrfToken: res.locals.csrfToken,
      errors: [{ msg: "El usuario ya está registrado" }],
      user: {
        name,
        email,
      },
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    token: generateId(),
  });

  // Send confirmation email

  registerEmail({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  res.render("templates/message.pug", {
    page: "Cuenta Creada Correctamente",
    message: "Hemos enviado un correo de confirmación, presiona el enlace",
  });
};

// Confirm account by email
const emailConfirmation = async (req, res) => {
  const { token } = req.params;

  // verify if token is valid
  const user = await User.findOne({ where: { token } });
  if (!user) {
    return res.render("auth/account-confirmation", {
      page: "Error al confirmar cuenta",
      message: "Hubo un error alconfirmar tucuenta. Intentalo de nuevo",
      error: true,
    });
  }

  // Confirm acc
  user.token = null;
  user.confirmed = true;
  await user.save();

  res.render("auth/account-confirmation", {
    page: "Cuenta confirmada",
    message: "La cuenta se confirmó correctamente",
  });
};

const loginForm = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar Sesión",
    csrfToken: res.locals.csrfToken,
  });
};

const forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password", {
    page: "Recuperar Contraseña",
    csrfToken: res.locals.csrfToken,
  });
};

const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("El email no es válido").run(req);
  let result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render("auth/forgot-password", {
      page: "Recuperar Contraseña",
      csrfToken: res.locals.csrfToken,
      errors: result.array(),
    });
  }
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.render("auth/forgot-password", {
      page: "Recuperar Contraseña",
      csrfToken: res.locals.csrfToken,
      errors: [{ msg: "Error: El usuario no existe" }],
    });
  }
  // Generate new token
  user.token = generateId();
  await user.save();

  // Send email
  resetPasswordEmail({
    name: user.name,
    email: user.email,
    token: user.token,
  })
  // Send confirmation email
  res.render("templates/message.pug", {
    page: "Restablecer Contraseña",
    message: "Hemos enviado un correo para restablecer tu contraseña",
  });
};


const verifyTokenForm = async (req, res)=> {
  const {token} =  req.params;
  const user = await User.findOne({ where: { token } });

 if (!user) {
    return res.render("auth/account-confirmation", {
      page: "Error al restablecer password",
      message: "Hubo un error al restablecer tu contraseña. Intentalo de nuevo",
      error: true,
    });
  }
  res.render('auth/reset-password',{

  })
}

const newPassword =  (req, res) => {

}
export {
  emailConfirmation,
  forgotPasswordForm,
  loginForm,
  register,
  registerForm,
  resetPassword,
  verifyTokenForm,
  newPassword
};

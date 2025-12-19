import { check, validationResult } from "express-validator";
import User from "../models/Usuario.js";
import { generateId } from "../helpers/tokens.js";
import { registerEmail } from "../helpers/emails.js";
const registerForm = (req, res) => {
  res.render("auth/register", {
    page: "Crear Cuenta",
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

const loginForm = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar Sesión",
  });
};
const forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password", {
    page: "Recuperar Contraseña",
  });
};

export { loginForm, registerForm, register, forgotPasswordForm };

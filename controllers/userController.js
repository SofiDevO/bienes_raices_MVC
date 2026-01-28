import { check, validationResult } from "express-validator";
import { generateId } from "../helpers/tokens.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { registerEmail, resetPasswordEmail } from "../helpers/emails.js";
import { errMessage, handleValidationErrors } from "../helpers/validations.js";

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
  if (handleValidationErrors(result, res, "auth/register", "Crear Cuenta", { name, email })) return;
  // Check if user is already registered
  const userExist = await User.findOne({ where: { email } });
  if (userExist) {
    errMessage("auth/register", "Crear Cuenta", "El usuario ya está registrado", res, { name, email });
    return;
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
    errMessage("auth/confirm-account", "Confirmar Cuenta", "Error al confirmar tu cuenta, intenta de nuevo", res);
    return;
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
// Authenticate user (Login)
const authenticateUser = async (req,res)=>{
  const { email, password } = req.body;
  await check('email').isEmail().withMessage('Este no es un email válido').run(req)
  await check('password').notEmpty().withMessage('Password es obligatorio').run(req)
  let result = validationResult(req);
  if (handleValidationErrors(result, res, "auth/login", "Iniciar Sesión", { email, password })) return;

    const user = await User.findOne({where: {email}});
    if (!user) {
      errMessage("auth/login", "Iniciar Sesión", "El usuario no existe", res, { email });
      return;
    }
    // check if user is confirmed
    if(!user.confirmed){
      errMessage("auth/login", "Iniciar Sesión", "Tu cuenta no ha sido confirmada", res, { email });
      return;
    }
    // check password
    if (!(await user.verifyPassword(password))) {
      errMessage("auth/login", "Iniciar Sesión", "El password es incorrecto", res, { email });
      return;
    }

    // TODO: Implement session/JWT authentication
    res.send("Autenticación exitosa");
  };



// olvided password
const forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password", {
    page: "Recuperar Contraseña",
    csrfToken: res.locals.csrfToken,
  });
};

const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("El email no es válido").run(req);
  let result = validationResult(req);

  if (handleValidationErrors(result, res, "auth/forgot-password", "Recuperar Contraseña")) return;
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    errMessage("auth/forgot-password", "Recuperar Contraseña", "Error: El usuario no existe", res);
    return;
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
    errMessage("auth/forgot-password", "Recuperar Contraseña", "Error al validar el enlace", res);
    return;
  }
  res.render('auth/reset-password',{
    page: 'Restablecer Contraseña',
    csrfToken: res.locals.csrfToken
  })
}

const newPassword =  async (req, res) => {
  const { password } = req.body;
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe tener al menos 6 caracteres")
    .run(req);
  // Validate password confirmation
  await check("password_confirmation")
    .equals(password)
    .withMessage("Los passwords no son iguales")
    .run(req);

    let result = validationResult(req);
    // Verified if result is empty
    if (handleValidationErrors(result, res, "auth/reset-password", "Restablecer Contraseña", { password })) return;
    const {token} = req.params;
    const user = await User.findOne({where: {token}});

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.token = null;
    await user.save();

    res.render("auth/account-confirmation", {
      page: "Contraseña Restablecida",
      message: "La contraseña se restableció correctamente",
    });
  }




  export {
  emailConfirmation,
  forgotPasswordForm,
  loginForm,
  register,
  registerForm,
  resetPassword,
  verifyTokenForm,
  newPassword,
  authenticateUser
};

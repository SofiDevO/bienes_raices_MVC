import crypto from "crypto";

/**
 * Genera un token CSRF aleatorio y seguro
 * @returns {string} Token CSRF de 48 caracteres hexadecimales
 */
const generateCsrfToken = () => {
  return crypto.randomBytes(24).toString("hex");
};

/**
 * Middleware que genera o recupera el token CSRF y lo hace disponible en la solicitud
 * Si no existe un token en las cookies, genera uno nuevo y lo almacena
 * El token se expone en req.csrfToken y res.locals.csrfToken para usarlo en las vistas
 *
 * @param {import('express').Request} req - Objeto de solicitud de Express
 * @param {import('express').Response} res - Objeto de respuesta de Express
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware
 */
const csrfMidelware = (req, res, next) => {
  if (!req.cookies.csrfToken) {
    const csrfToken = generateCsrfToken();
    res.cookie("csrfToken", csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });
    req.csrfToken = csrfToken;
  } else {
    req.csrfToken = req.cookies.csrfToken;
  }
  res.locals.csrfToken = req.csrfToken;
  next();
};

/**
 * Middleware que verifica la validez del token CSRF en solicitudes que modifican datos
 * Solo valida métodos POST, PUT, DELETE y PATCH
 * Compara el token de la cookie con el token enviado en el cuerpo (_csrf) o en el header (x-csrf-token)
 *
 * @param {import('express').Request} req - Objeto de solicitud de Express
 * @param {import('express').Response} res - Objeto de respuesta de Express
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware
 * @throws {Error} Error 403 si el token CSRF no es válido o no coincide
 */
const verifyCsrfToken = (req, res, next) => {
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    return next();
  }
  const csrfTokenFromCookie = req.cookies.csrfToken;
  const csrfTokenFromBody = req.body._csrf || req.headers["x-csrf-token"];
  if (csrfTokenFromCookie !== csrfTokenFromBody) {
    const error = new Error("Unknown error");
    error.status = 403;
    return next(error);
  }
  next();
};

/**
 * Middleware que regenera el token CSRF después de operaciones que modifican datos
 * Solo se ejecuta en métodos POST, PUT, DELETE y PATCH
 * Útil para prevenir ataques de reutilización de tokens (rotation de tokens)
 *
 * @param {import('express').Request} req - Objeto de solicitud de Express
 * @param {import('express').Response} res - Objeto de respuesta de Express
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware
 */
const regenerateCsrfToken = (req, res, next) => {
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    return next();
  }
  const newCsrfToken = generateCsrfToken();
  res.cookie("csrfToken", newCsrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 360000, // 1 hour
  });
  req.csrfToken = newCsrfToken;
  res.locals.csrfToken = newCsrfToken;
  next();
};

export { csrfMidelware, verifyCsrfToken, regenerateCsrfToken };
import nodemailer from "nodemailer";

// Función para enviar el email de registro
const registerEmail = async (data) => {
  // Configuramos el transporte de nodemailer con las credenciales de nuestro servidor de correo
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log(data);
  const { email, nombre, token } = data;

  // Enviar el email
  await transport.sendMail({
    from: "Bienes Raíces", // Remitente del correo
    to: email, // Destinatario del correo
    subject: "Confirma tu cuenta en Bienes Raíces dot com", // Asunto del correo
    text: "Confirma tu cuenta en Bienes Raíces dot com", // Texto plano del correo
    html: `
      <h3>Hola ${nombre}.</h3>
      <p>Tu cuenta fue creada con éxito. Para verificarla solo da click en el siguiente enlace:</p>
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-align: center; text-decoration: none; border-radius: 5px;">Confirmar cuenta</a>
      <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>
    `, // HTML del correo
  });
};

// Exportar la función para usarla en otras partes de la aplicación
export { registerEmail };

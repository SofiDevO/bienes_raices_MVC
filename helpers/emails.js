import nodemailer from "nodemailer";

const registerEmail = async (data) => {
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
  // Enviar email
  await transport.sendMail({
    from: "Bienes raices",
    to: email,
    subject: "Confirma tu cuenta en Bienes raices dot com",
    text: "Confirma tu cuenta en Bienes raices dot com",
    html: `
        <h3>Hola ${nombre}.</h3>

    <p>Tu cuenta fue creada con éxito. Para verificarla solo da click en el siguiente enlace:</p>
    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-align: center; text-decoration: none; border-radius: 5px;">Confirmar cuenta</a>
    <p>Si tú no creaste esta cuenta, puedes ignorar el mensaje.</p>
    `
  });
};


const forgotPassword = async (data) => {
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
  // Enviar email
  await transport.sendMail({
    from: "Bienes raices",
    to: email,
    subject: "Restablece tu contraseña de  Bienes raices dot com",
    text: "Restablece tu contraseña de  Bienes raices dot com",
    html: `
        <h3>Hola ${nombre}. Haz solicitado reestablecer  tu password en Bienes Raices </h3>

    <p>Haz click en el siguiente enlace para generar un password nuevo:</p>
    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-align: center; text-decoration: none; border-radius: 5px;">Recuperar password</a>
    <p>Si tú no solicitaste el cambio de contraeña, puedes ignorar el mensaje.</p>
    `
  });
};


export { registerEmail,forgotPassword };

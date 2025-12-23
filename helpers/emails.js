import nodemailer from 'nodemailer';

const registerEmail = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port:  process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const { name, email, token } = data;



  await transport.sendMail({
    from: 'sofidev',
    to: email,
    subject: 'Confirma tu cuenta en Bienes raices',
    text: 'Confirma tu cuenta en Bienes raices',
    html: `<h2>Hola ${name}, confirma tu cuenta en Bienes Raices</h2>
    <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>
    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}"  >Confirmar Cuenta</a>
    <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
    `
  })
};
export { registerEmail };

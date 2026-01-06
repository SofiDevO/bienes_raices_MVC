import nodemailer from 'nodemailer';
import pug from 'pug';
import juice from 'juice';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create transport configuration
const createTransport = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};


const renderEmailTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, '..', 'views', 'emails', `${templateName}.pug`);
  // Compile Pug template to HTML
  const html = pug.renderFile(templatePath, data);

  // Inline CSS for email compatibility
  const inlinedHtml = juice(html);

  return inlinedHtml;
};

const registerEmail = async (data) => {
  const transport = createTransport();
  const { name, email, token } = data;

  // Prepare template data
  const templateData = {
    name,
    confirmUrl: `${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}`,
    title: 'Confirma tu cuenta en Bienes Raíces'
  };

  // Render email template
  const htmlContent = renderEmailTemplate('register-confirmation', templateData);

  await transport.sendMail({
    from: 'Bienes Raíces <noreply@bienesraices.com>',
    to: email,
    subject: 'Confirma tu cuenta en Bienes Raíces',
    text: `Hola ${name}, confirma tu cuenta en Bienes Raíces visitando: ${templateData.confirmUrl}`,
    html: htmlContent
  });
};

const resetPasswordEmail = async (data) => {
  const transport = createTransport();
  const { name, email, token } = data;

  // Prepare template data
  const templateData = {
    name,
    resetUrl: `${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/reset-password/${token}`,
    title: 'Restablece tu contraseña en Bienes Raíces'
  };

  // Render email template
  const htmlContent = renderEmailTemplate('password-reset', templateData);

  await transport.sendMail({
    from: 'Bienes Raíces <noreply@bienesraices.com>',
    to: email,
    subject: 'Restablece tu contraseña en Bienes Raíces',
    text: `Hola ${name}, restablece tu contraseña en Bienes Raíces visitando: ${templateData.resetUrl}`,
    html: htmlContent
  });
};

export { registerEmail, resetPasswordEmail };

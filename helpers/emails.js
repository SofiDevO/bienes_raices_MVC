import nodemailer from 'nodemailer';
const registerEmail = async (data) => {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "652174d220c6df",
      pass: "8157723341bc0c",
    },
  });
};


export { registerEmail };
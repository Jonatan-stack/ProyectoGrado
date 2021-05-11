const nodemailer = require('nodemailer');

module.exports = (formulario) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'emailparapfc@gmail.com', // Cambialo por tu email
      pass: 'pqbbidoiemeikvhn' // Cambialo por tu password
    }
  });

  const mailOptions = {
    from: `"${formulario.displayName} 👻" <${formulario.email}>`,
    to: 'jonatanaocv@gmail.com', // Cambia esta parte por el destinatario
    subject: 'Falta',
    html: `
    <strong>Nombre:</strong> ${formulario.displayName} <br/>
    <strong>E-mail:</strong> ${formulario.email}  <br/>
    <strong>Mensaje:</strong> ${formulario.uid}
    `
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });
}
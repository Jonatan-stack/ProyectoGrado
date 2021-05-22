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
    from: ` ${formulario.from} `,
    to: ` ${formulario.emailDestinatario} `, // Cambia esta parte por el destinatario
    subject: ` ${formulario.asunto}  de  ${formulario.from} `,
    html: ` ${formulario.mensaje} `,
    attachments: [
      {   // utf-8 string as an attachment
          path: `${formulario.archivo}`,
      }
    ]
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });
}
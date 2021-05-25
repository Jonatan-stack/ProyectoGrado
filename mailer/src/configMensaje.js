const nodemailer = require('nodemailer');

module.exports = (formulario) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'emailparapfc@gmail.com',
      pass: 'pqbbidoiemeikvhn'
    }
  });

  var mailOptions = comprobarArchivo(formulario);

  transporter.sendMail(mailOptions, function (err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });
}

function comprobarArchivo(formulario){
  var mailOptions;
  if(formulario.tieneArchivo == 'S'){
    mailOptions = {
      from: ` ${formulario.from} `,
      to: ` ${formulario.emailDestinatario} `, // Cambia esta parte por el destinatario
      subject: ` ${formulario.asunto}  de  ${formulario.from} `,
      html: ` ${formulario.mensaje} `,
      attachments: [
        {   // utf-8 string as an attachment
            path: `${formulario.archivo}`,
        }
      ]
    }
  }
  else{
    mailOptions = {
      from: ` ${formulario.from} `,
      to: ` ${formulario.emailDestinatario} `, // Cambia esta parte por el destinatario
      subject: ` ${formulario.asunto}  de  ${formulario.from} `,
      html: ` ${formulario.mensaje} `
    }
  }
  return mailOptions;
}
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions,(err)=>{
    if(err){
      console.log("it has an error",err)
    }else{
      console.log("it has sent")
    }
  });
};

module.exports = sendEmail;

import nodemailer from 'nodemailer'

export async function sendEmailService({
    to,
    subject,
    message,
    attachments = [],
  } = {}) {
    // configurations
    const transporter = nodemailer.createTransport({
      host: 'localhost', // stmp.gmail.com
      port: 587, // 587 , 465
      secure: false, // false , true
      service: 'gmail', // optional
      auth: {
        // credentials
        user: 'lamiaaemad1172@gmail.com',
        pass: 'wsgh xewg pjkt qkti',
        
      },
    })
  
    const emailInfo = await transporter.sendMail({
      from: '"loma  👻" <lamiaaemad1172@gmail.com>',
      to: to ? to : '',
      subject: subject ? subject : 'Hello',
      html: message ? message : '',
      attachments,
    })
    if (emailInfo.accepted.length) {
      return true
    }
    return false
  }

//wsgh xewg pjkt qkti

const nodemailer = require('nodemailer');

async function sendMail({from ,to ,subject,text,html }){


    let transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        Port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.SMTP_LOGIN,
            pass:process.env.SMTP_PASSWORD,
        }
    })

    // console.log("transporter",transporter)

// these are built in function of sendmail down
// yahan nodemailer ko varaible ke andr apna data store kr rhy hai
    let info = await transporter.sendMail({
        from:`inShare ${from}`,
        to:to,
        subject:subject,
        text:text,
        html:html
    });

    // console.log("info",info)


}




module.exports =sendMail;
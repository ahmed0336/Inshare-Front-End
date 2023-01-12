const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');
// const sendMail = require('../services/emailService');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile'); //100mb

router.post('/', (req, res) => {

  // console.log("check",req.file)
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }

        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
      });
});


router.post('/send', async (req,resp)=>{

  // console.log("req.body==>",req.body)

const { uuid , emailTo , emailFrom} = req.body;

// if(!uuid || !emailTo || emailFrom){
  if(!uuid || !emailTo || !emailFrom) {

  resp.json({
    message:"All fields are  Required",
     status:false
  })
}

// get data from database

// let file = await File.findOne({uuid:uuid})
const file = await File.findOne({ uuid: uuid });

console.log("file",file)

if(file.sender){

  resp.status(422).json({
    message:"Email already sent",
     status:false
  })

}

// if(file.sender) {
//   return resp.status(422).send({ error: 'Email already sent once.'});
// }

file.sender = emailFrom,
file.receiver = emailTo

let response =await file.save();

// send Email

console.log(`${process.env.APP_BASE_URL}/files/${uuid}`)

const sendMail = require('../services/emailService')

sendMail({
 
  from:emailFrom,
  to:emailTo,
  subject: "inshare File Sharing",
  text: `${emailFrom} shared a file with you` ,
  // html me hum email template use krege jo inbox me nazar ata hai
  // html:require('../services/emailTemplate')({
  //   emailFrom: emailFrom,
  //   downLinkLink:`${process.env.APP_BASE_URL}/files/${uuid}`,
  //   size: parseInt(file.size/1000) + 'KB',
  //   expires:"24 hours"
  // })
  html: require('../services/emailTemplate')({
    emailFrom, 
    // downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
    downloadLink:"https://www.youtube.com/watch?v=_xKCi5OI_Mg&t=5436s",
    size: parseInt(file.size/1000) + ' KB',
    expires: '24 hours'
})

  


})

resp.status(200).json({
  message:"Sucessfull ",
  Status:true
})




} )


// router.post('/send', async (req, res) => {
//   const { uuid, emailTo, emailFrom, expiresIn } = req.body;
//   if(!uuid || !emailTo || !emailFrom) {
//       return res.status(422).send({ error: 'All fields are required except expiry.'});
//   }
//   // Get data from db 
//   try {
//     const file = await File.findOne({ uuid: uuid });
//     if(file.sender) {
//       return res.status(422).send({ error: 'Email already sent once.'});
//     }
//     file.sender = emailFrom;
//     file.receiver = emailTo;
//     const response = await file.save();
//     // send mail
//     const sendMail = require('../services/emailService');
//     sendMail({
//       from: emailFrom,
//       to: emailTo,
//       subject: 'inShare file sharing',
//       text: `${emailFrom} shared a file with you.`,
//       html: require('../services/emailTemplate')({
//                 emailFrom, 
//                 downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
//                 size: parseInt(file.size/1000) + ' KB',
//                 expires: '24 hours'
//             })
//     }).then(() => {
//       return res.json({success: true});
//     }).catch(err => {
//       return res.status(500).json({error: 'Error in email sending.'});
//     });
// } catch(err) {
//   return res.status(500).send({ error: 'Something went wrong.'});
// }

// });



module.exports=router
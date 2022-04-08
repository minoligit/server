const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

router.post('/sendEmail',(req,res) =>{

  const receiver = req.body.receiver;
  const subject = req.body.subject;
  const message = req.body.message;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'localhost',
    port: 465,
    secure: false,
    auth: {
      user: 'testfdo97@gmail.com',
      pass: 'TestEmail@97'
    }
  });
  
  var mailOptions = {
    from: 'testfdo97@gmail.com',
    to: receiver,
    subject: subject,
    text: message
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email Sent');
    }
  });
  console.log("fdf");
})


module.exports = router;

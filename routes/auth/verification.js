let express = require('express');
let nodemailer = require('nodemailer');
let User = require('../../models/users');

let router = express.Router();

//Email verificcation
router.get('/verify',(req, res) => {
    User.findOneAndUpdate({email: req.query.email}, {$set: {verified: true}}, {new: true}, function(err, user){
        if(err){
            res.send({success: false, message: err});
        }else{
            if(user)
                return res.send({success: true, message: 'email successfully verified'});
            return res.send({success: false, message: 'User not found'});
        }
    });
});

//Send verification email
router.get('/sendEmail', (req, res) => {
    console.log('Sending to '+req.query.email);
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'jadbassil1@gmail.com',
          pass: '786512349'
        }
      });

      var mailOptions = {
        from: 'jadbassil1@gmail.com',
        to: req.query.email,
        subject: 'Unicorn email verification',
        html: '<a href=\"http://localhost:3000/api/verification/verify?email='+req.query.email+'\">Click here</a> to verify your email',
      };

      transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            res.statusCode(501).send({success:false, message: 'Unable to send email'});
        } else {
            res.send({success:true, message: 'Email successfully sent'});
        }
      });
});

module.exports = router;


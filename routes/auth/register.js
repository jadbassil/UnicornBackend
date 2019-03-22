const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

let User = require('../../models/users');

router.post('/', (req, res) => {
  let newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    token:"",
    created_at: new Date()
  });

  newUser.save(function(err, user){
    if (err){
      console.log(err);
      res.json({success: false, message: "new User saving failed " + err});
    } else{
      var sent = false;
      console.log(user.email);
      axios.get('http://localhost:3000/api/verification/sendEmail', {params:{email:user.email}})
        .then(function(response){
          console.log(response);
          if(response.data.success == true)
            sent = true;
        })
        .catch(function(error){
          console.log(error);
        })
        .then(function(){
          if(sent)
            return res.send({success:true, userCreated:true, emailSent: true, message:'User created and verification email sent'});
          return res.send({success: false, userCreated:true, emailSent: false,  message: 'User created but could not send verification email'});
        });
    }
  });

});

module.exports = router;





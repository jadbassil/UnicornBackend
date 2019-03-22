var express = require('express');
var router = express.Router();
var User = require('../../models/users');
var jwt = require('jsonwebtoken');
var config = require('../../config');

router.post('/', function(req, res, next) {
  
  //Find The User
  User.findOne({
   username: req.body.username
  }).then(function(user,err){
    if (err) {console.log(err); return res.json({success:false, message: err});}

    if (!user) {
      res.json({ success: false,verified:false, message: 'Authentication failed. User not found.' });  
    }else if (user) {
      //Test if user's email is verified
      if(!user.verified)
        return res.json({success: false, verified: false, message:'Email not verified'});

      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {console.log(err); return res.json({success: false, verified: true, message: err});}
        if(!isMatch) return res.send({success: false, verified: true, message: 'incorrect password'});
        
        var payload = { id: user._id, username: user.username, email: user.email };        
        var token = jwt.sign(payload,config.secret);

        User.findById(user._id, function(err, result) {
            if (err) {console.log(err); return res.json({success:false, verified: true, message: err});}
            user.token = token;
            user.save(function(err) {
                if (err) {console.log(err); return res.json({success:false, verified: true, message: err});}
                res.send({success:true, verified: true, data:user});            
              });
          });
      });
    }
  });
});

module.exports = router;

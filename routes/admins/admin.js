const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const Admins = require('../../models/admins');


const router = express.Router();

router.post('/register', (req, res) => {
    
    let newAdmin = new Admins({
        username: req.body.username,
        password: req.body.password,
        token: ''
    });

    newAdmin.save((err, admin) => {
        if(err)  return res.json({success: false, message: err});
        return res.json({success: true, message: 'admin successfully registered', data: admin});
    });
});

router.post('/login', (req, res) => {
    Admins.findOne({username: req.body.username}, (err, admin) => {
        if(err) {console.log(err); return res.json({success:false, message: err});}
        if(admin){
                        
            admin.comparePassword(req.body.password, function(err, isMatch){
                if(err) {console.log(err); return res.json({success:false, message: err});}
                if(!isMatch) return res.json({success: false, message: 'incorrect password'});
                
                let payload = {id: admin._id, username: admin.username};
                let token = jwt.sign(payload, config.secret);
                
                Admins.findByIdAndUpdate(admin._id, {$set:{token: token}},{new: true}, function(err, result){
                    if(err) {console.log(err); return res.json({success:false, message: err});}
                    if(result) return res.json({success: true, message: 'success', data: result});
                    else
                        return res.json({success: false, message: 'admin not found'});
                });
            });
        } else {
            return res.json({success:false, message: 'username not found'});
        }
    });
});

router.post('/logout', function(req, res){
    if(req.token){
        Admins.findOneAndUpdate({token: req.token}, {$set: {token: ''}}, {new: true}, function(err, doc){
            if(err){
                console.log(err);
                return res.json({success: false, error: err});
            }
            if(doc){
                return res.json({success: true, admin: doc}); 
            }else{
                return res.json({success: false, message: 'admin not found'});
            }
        });
    }else{
        return res.json({success: false, message: 'no token provided'});
    }
    
}); 

module.exports = router;


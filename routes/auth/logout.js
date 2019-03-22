var express = require('express');
var User = require('../../models/users');

const router = express.Router();

router.post('/', function(req, res, next){
    User.findOneAndUpdate({token: req.token}, {$set: {token: ''}}, {new: true}, function(err, doc){
        if(err || doc == null){
            res.send({success: false, error: err});
        }else{
            res.send({success: true, user: doc});
        }
    });
}); 

module.exports = router;
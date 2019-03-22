const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../../config');
const jwt = require('jsonwebtoken');

let Deals = require('../../models/deals');
let Admins = require('../../models/admins');

router.delete('/', (req, res) => {

  // decode token
  if (req.token) {

    Admins.findOne({token: req.token}, function(err, admin){
      console.log(req.body.id);
      if(err){
        return res.send({success: false, message: 'Failed to authenticate admin', error: err});
      }else{
        Deals.findByIdAndRemove(req.body.id)
        .then(deal => {
          if(!deal){
            return res.status(404).send({success: false, message: "Note not found with id" + req.body.id});
          }
          res.send({success: true, message: 'deleted successfully'});
        })
        .catch(err => {
          return res.send({success:false, message: err});
        });
      }
    });
      
  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

module.exports = router;
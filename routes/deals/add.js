const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Admins = require('../../models/admins');

let Deals = require('../../models/deals');

router.post('/', (req, res) => {

  // decode token
  if (req.token) {
    
    Admins.findById(req.decoded.id, (err, admin) => {
      if(err) return res.json({success: false, message: err});
      if(admin){
        let newDeal = new Deals({
          title:req.body.title,
          image:req.body.image,
          description:req.body.description,
          link:req.body.link,
          discount:req.body.discount
        });

        newDeal.save(function(err, deal){
          if (err){
            console.log(err);
            res.json({message: "new deal saving failed " + err});
          } else{
            console.log('deal created');
            res.json({success:true,data:deal});
          }
        });
      } else {
        res.json({success: false, message: 'unable to identify admin'});
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






var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Deals = require('../../models/deals');
var config = require('../../config');

/* GET home page. */
router.get('/', function(req, res, next) {

    // decode token
    if (req.token) {
        
      Deals.find({}, function(err, deals) {
        var userMap = {};
    
        deals.forEach(function(deal) {
          userMap[deal._id] = deal;
        });
    
        res.send(userMap);  
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

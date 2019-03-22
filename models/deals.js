var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var dealsSchema = new Schema({
  title: String,
  Description:String,
  link: String,
  discount:String,
  image: String
});

var Deals = mongoose.model('Deals', dealsSchema);

module.exports = Deals;
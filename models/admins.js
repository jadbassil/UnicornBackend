var mangoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mangoose.Schema;

var adminSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    token: String,
});

var SALT_WORK_FACTOR = 10;

adminSchema.pre('save', function(next){
    var admin = this;
    if(!admin.isModified())
        return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err)
            return next(err);
        bcrypt.hash(admin.password, salt, function(err, hash){
            if(err)
                return next(err);
            admin.password = hash;
            next();
        });
    });
});

adminSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var Admin = mangoose.model('Admin', adminSchema);

module.exports = Admin;


var mongoose = require('mongoose');
var schema = mongoose.Schema;
var crypto = require('crypto');


var user = new schema({
    firstname : {type:String ,required:true},
    lastname : {type:String ,required:true},
    emailId : {type : String, required: true},
    password : { type: String, required : true},
    photo : {type : String, required : false},
    username : {type : String, required : true},
    verificationStatus : {type:String, required: true, default:'pending'},
    deleteStatus :{ type:String, default:'disable'},
    status:{type:String, default:'active'},
    // address : {type : String, required : false},
    // city : {type : String, required : [false, 'why no city']},
    // state : {type : String, required : false},
    mobile : { type: Number, require: true},
    verificationToken: {type:String}
},{

});

user.index({email:1},{unique:true});

var userModel = mongoose.model('User', user);

module.exports = {
    User : userModel
}
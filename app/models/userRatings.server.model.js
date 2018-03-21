
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userRatingSchema = new schema({
    rate:{type:Number,default:0},
    reviewAbout:{type:String},
    title:{type:String},
    description:{type:String},
    status:{type:String,default:'disable'},
    verifiedStatus:{type:String, default:'pending'},
    user:{type:String},
    deleteStatus:{type:String, default:'disable'}
});

var userRatingModel = mongoose.model('userrating',userRatingSchema);
module.exports = {
    'userRating': userRatingModel
}
var mongoose  = require('mongoose');
var schema = mongoose.Schema;
var cmsSchema = new schema({
    title:{type:String, required:true}, 
    url:{type:String, required:true},
    content:{type:String, required:true},
    deleteStatus:{type:String,default:'disable'}
});

var cmsModel = mongoose.model('cmsData',cmsSchema);


module.exports = {
    'Cms':cmsModel
}
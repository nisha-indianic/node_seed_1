var globalMethods = require('./../../configs/globals');
var config = require('./../../configs/configs');

var _ = require('lodash');

var userRating = require('./../models/userRatings.server.model').userRating;

/*************
Purpose: user rating list for admin view
Parameter: {
    page:1,
    pagesize:10,
    sort:{'rate':1}
}
Return: JSON String
****************/

exports.userRatingListing = (req,res)=>{
    var params = ['page','pagesize','sort'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        var page = parseInt(req.body.page,10);
        var pagesize = parseInt(req.body.pagesize,10);
        var sort = req.body.sort;
        var skip = (page-1)*pagesize;
        var index = _.findIndex(config.adminEmails, req.body.email);
        if(req.body['role'] == 'admin'){
            userRating.find({},{__v:0}).skip(skip).limit(pagesize).sort(sort).exec((err,list)=>{
                if(err){
                    res.send({status:0, message:err});
                }else{
                    userRating.count((err, total)=>{
                        if(err){
                            res.send({status:0, message: error});
                        }else{
                            res.send({status:1, message:'User rating list', page:page, pagesize:pagesize,total:total, data:list});
                        }
                    });

                    
                }
            });
        }else{
            res.send({status:0, message:'Invalid user'});
        }
    }
    
}

/*************
Purpose: edit user rating by Admin
Parameter: {
    user:'john@gmail.com' // not editable only for update data
    verifiedStatus:'active',
    title:'product',
    description:'best product ever',
    rate:5
}
Return: JSON String
****************/

exports.editUserRating = (req,res)=>{
    var params = ['user','verifiedStatus','title','description','rate'];
    var error = globalMethods.checkRequireParam(params, req);
    var index = _.findIndex(config.adminEmails, req.body.email);
    if(req.body['role'] == 'admin' ){
        if(error.length>0){
            res.send({status:0, message:error});
        }else{
            userRating.findOneAndUpdate({user:user},{$set:{verifiedStatus:req.body.verifiedStatus,title:req.body.title,description:req.body.description,rate:req.body.rate}}).exec((err,data)=>{
                if(err){
                    res.send({status:0, message:err});
                }else{
                    res.send({status:1, message:'update userRating successfully', data:result});
                }
            });
        }
    }else{
        res.send({status:0, message:'Invalid user'});
    }
}

/*************
Purpose: delete user rating by Admin
Parameter: {
    user:'john@gmail.com' // not editable only for update data
}
Return: JSON String
****************/

exports.deleteUserRating = (req,res)=>{
    params = ['user'];

    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        if(req.body['role'] == 'admin'){
            userRating.findOneAndUpdate({user:req.body.user},{$set:{deleteStatus:'active'}}).exec((err, result)=>{
                if(err){
                    res.send({status:0, message:err});
                }else{
                    res.send({status:1,message:'Delete user rating'});
                }
            });
        }else{
            res.send({status:0, message:'Invalid user'});
        }
    }

}

/*************
Purpose: delete users rating by Admin
Parameter: {
    users:'john@gmail.com,bob@gmail.com'  // not editable only for update data (comma seperated string)
}
Return: JSON String
****************/
exports.deleteUserRatings = (req,res)=>{
    params = ['users'];
    var error =globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        if(req.body['role'] == 'admin'){
            var users = req.body.users.toString().split(",");
            var calls = [];
            users.forEach((user)=>{
                calls.push((callback)=>{
                    userRating.findOneAndUpdate({user:user},{$set:{deleteStatus:'active'}}).exec((err, detail)=>{
                        if(err){
                            callback(true, err);
                            // res.send({status:0, message:err});
                        }else{
                            callback(false, 'Success');
                        }
                    });
                });
            });

            async.parallel(calls, (err, data)=>{
                if(err){
                    res.send({status:0, message:err});
                }else{
                    res.send({status:1, message:'Delete user rating.'});
                }
            });
        }else{
            res.send({status:0, message:'Invalid user'});
        }
    }
}

/*******************
Purpose : approve user rating by admin
Parameters : {
    id:'5aab60a9fa8a15078227d974',
    email:'nisha.rathod@indianic.com'
}  

Retuen : json string 
 *******************/

 exports.approveUserRating = (req, res)=>{
    var params = ['email', 'id'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        userRating.findOneAndUpdate({_id:req.body.id, user:req.body.email}, {$set:{verifiedStatus:'active'}}).exec((err, result)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status: 1, message:'User rating approved .', data:result});
            }
        });
    }
 }

 /*******************
Purpose : reject user rating by admin
Parameters : {
    id:'5aab60a9fa8a15078227d974',
    email:'nisha.rathod@indianic.com'
}  

Retuen : json string 
 *******************/

exports.rejectUserRating = (req, res)=>{
    var params = ['email', 'id'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        userRating.findOneAndUpdate({_id:req.body.id, user:req.body.email}, {$set:{verifiedStatus:'disable'}}).exec((err, result)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status: 1, message:'User rating rejected .', data:result});
            }
        });
    }
 }
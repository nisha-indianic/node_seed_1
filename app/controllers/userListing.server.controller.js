var globalMethods = require('../../configs/globals');
var config = require('../../configs/configs');
var User = require('../models/user.server.model').User;

var path = require('path');
var _ = require('lodash');
var async = require('async');
var csvjson = require('csvjson');
var converter = require('json-2-csv');
var mv = require('mv');
var multiparty =require('multiparty');

/*************
Purpose: User listing for admin
Parameter: {
    page:1,
    pagesize:10,
    sort:{'fistname':1,'emailId':-1}
}
Return: JSON String
****************/
exports.userListing = (req,res)=>{
    var params = ['page','pagesize','sort'];
    var error = globalMethods.checkRequireParam(params,req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        var page = parseInt(req.body.page,10);
        var pagesize = parseInt(req.body.pagesize,10);
        var sort = req.body.sort;
        console.log(sort);
        var skip = (page-1)*pagesize;
        console.log("page --" , page);
        console.log("page size--" , skip);
        // var index = _.findIndex(config.adminEmails, req.body.email);
        if(req.body['role'] == 'admin'){
            User.find({}).skip(skip).limit(pagesize).sort(sort).exec((err, result)=>{
                if(err){
                    res.send({status:0, message: err});
                }else{

                    User.count((err, total)=>{
                        if(err){
                            res.send({status:0, message: error});
                        }else{
                            res.send({status:1, message:'user listing ', data:result, total:total, page: page, pagesize:pagesize});
                        }
                    });
                    
                }
            });   
            
        }else{
            res.send({status:0, message: 'Invalid user'});
            
        }
    }
} 

/*************
Purpose: edit user by admin
Parameter: {
    email:john@gmail.com,// not editable for update user
    firstname:John
    lastname:David
    mobile:1234567890,
    username:john123,
    status:'active',
    deleteStatus:'disable'
}
Return: JSON String
****************/

exports.editUserListing = (req,res)=>{
    var params = [ 'email', 'firstname', 'lastname', 'mobile', 'status', 'deleteStatus','username'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message: error});
    }else{
        var index = _.findIndex(config.adminEmails, req.body.email);
        if(req.body['role'] == 'admin'){
            User.findOneAndUpdate({emailId:req.body.email},{ $set: {firstname:req.body.firstname,lastname:req.body.lastname,mobile:req.body.mobile,status:req.body.status,username:req.body.username}}).exec((err, userDetail)=>{
                if(err){
                    res.send({status:0, message: err});
                }else{
                    res.send({status:1, message: 'User detail update successfully'});
                }
            });
        }else{
            res.send({status:0, message: 'Invalid User '});
        }

        
    }


}

/*************
Purpose: delete user by admin
Parameter: {
    useremail:john@gmail.com,
}
Return: JSON String
****************/

exports.deleteUser = (req,res)=>{
    var params = ['useremail'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message: error});
    }else{
        console.log(req.body.role)
        if(req.body['role'] == 'admin' ){
            User.findOneAndUpdate({emailId:req.body.useremail},{$set:{deleteStatus:'active'}}).exec((err, userDetail)=>{
                if(err){
                    res.send({status:0, message: error});
                }else{
                    res.send({status: 1, messge:' User delete successfully'});
            
                }
            });
        }else{
            res.send({status:0, message: 'Invalid User '});
        }
        
    }
}

/*************
Purpose: delete user by admin
Parameter: {
    useremails:john@gmail.com,bob@gmail.com // comma seperated string of emails
}
Return: JSON String
****************/

exports.deleteUsers = (req,res)=>{
    var params = [ 'useremails'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message: error});
    }else{
        
        if(req.body['role'] == 'admin'){
            var calls = [];
            var errUser = [], success = [];
            var emails = req.body.useremails.split(",");
            console.log(emails)
            emails.forEach(email=>{
                calls.push((callback)=>{
                    User.findOneAndUpdate({emailId:email},{$set:{deleteStatus:'active'}}).exec((err, userDetail)=>{
                        if(err){
                            err.push(email);
                            callback( true, err);
                        }else{
                            success.push(email);
                            callback(false, userDetail);
                        
                        }
                    });
                });
            });

            async.parallel(calls, (err, result)=>{
                if(err){
                    res.send({status:0, message: 'some user are not delete ', deletedUser: success, error:errUser});
                }else{
                    res.send({status:1, message: 'All user delete', deletedUser:success});
                }
            });
        }else{
            res.send({status:0, message: 'Invalid User '});
        }
        
    }
}

/*************
Purpose: download user list file (CSV format)
Parameter: {

}
Return: csv file
****************/

exports.downloadFile = (req,res)=>{
    User.find({},{_id:0,__v:0}).lean().exec((err,userDetails)=>{
        if(err){
            res.send({status:0, message:err});
        }else{
            
            var json2csvCallback = function (err, csv) {
                if (err) {
                    res.send({status:0, message:err});
                }else{
                    console.log(csv);
                    fs.writeFile('./public/uploads/sample.csv',csv, (err,result)=>{
                        if(err){
                            res.send({status:0,message:err});
                        }else{
                            res.sendFile('/Volumes/Data/Node-API-5.0.0/public/uploads/sample.csv')
                        }
                    });
                }
            };
            converter.json2csvPromisified(userDetails, json2csvCallback);
        }
    });
}

/*************
Purpose: upload user list file (CSV format)
Parameter: {

}
Return: json string
****************/
exports.uploadFile = (req,res)=>{
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        console.log(files)
        console.log('fields', fields)
            tmp_path = files.file[0].path;
            img_name = files.file[0].originalFilename;
            var s = img_name.split(".");
            var ext = s[(s.length-1)];
            var flname = Date.now()+"."+ext;
            // var loc = 
            let pro_pic = path.join(__dirname, '..','..','public','uploads',flname);
            console.log(pro_pic);
            // pro_pic = pro_pic.replace(/\s+/g, '');
            if (validateDoc(img_name)) {
                mv(tmp_path, pro_pic, { mkdirp: true }, function (err, data) {
                    if (err) {
                        res.send(sendErr(err));
                    } else {
                        // res.send({
                        // status: 1,
                        // message: 'image uploaded successfully',
                        // path: flname,
                        // // title: img_name.replace(/\s+/g, ''),
                        
                        // });


                        var data = fs.readFileSync(pro_pic, {encoding:'utf-8'});
                        var options = {
                            delimiter : ',', // optional
                            quote     : '"' // optional
                        } 
                        var jsonData = csvjson.toObject(data, options);
                        var feild = ['emailId','verificationStatus','firstname','lastname','status','username', 'password','mobile', 'deleetStatus','photo']
                        var calls = [];
                        jsonData.forEach((data)=>{
                            calls.push((callback)=>{
                                var newUser = new User();
                                console.log(newUser);
                                console.log("-------------");
                                _.merge(newUser,data);
                                console.log(newUser);
                                newUser.save((err,result)=>{
                                    if(err){
                                        callback(true, err);
                                    }else{
                                        callback(false, result);
                                    }
                                })
                            });
                        });
                        async.parallel(calls, (err,re)=>{
                            if(err){
                                res.send({status:0,message:err});
                            }else{
                                res.send({status:1, message:'upload successfully',data:re});
                            }
                        });
                    }
                });
            } else {
                res.send({
                status: 0,
                message: "Please use csv file"
                });
            }
        
    });
}

function validateDoc(val){
    if (val.match(/\.(csv)$/)) {
        return true;
    } else {
        return false;
    }
}
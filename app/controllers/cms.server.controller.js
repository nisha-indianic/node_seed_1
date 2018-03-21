var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');
var Cms = require('../models/cms.server.model').Cms;

/*************
Purpose: cms insert (insert based on url)
Parameter: {
    title:'contact', 
    content: ''
}
Return: json string
****************/
exports.insert = (req,res)=>{
    var params = ['title','content'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        var newCms =  new Cms();
        newCms.title = req.body.title;
        newCms.content = req.body.content;
        newCms.url = req.body.url;
        newCms.save((err,data)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status:1, message:'Save successfully', data:data});
            }
        });
    }
}


/*************
Purpose: cms update (update based on url )
Parameter: {
    title:'contact', 
    content: ''
}
Return: json string
****************/

exports.update = (req,res)=>{
    var params = ['title', 'content'];
    var error = globalMethods.checkRequireParam(params, req);
    if(error.length>0){
        res.send({status:0, message:error});
    }else{
        Cms.findOneAndUpdate({url:url},{$set:{title:req.body.title, content:req.body.content}}).exec((err, result)=>{
            if(err){
                res.send({status:0, message:err});
            }else{
                res.send({status:1, message:'Update successfully', data:result});
            }
        });
    }
}

/*************
Purpose: cms delete
Parameter: {
    
}
Return: json string
****************/

exports.delete = (req,res)=>{
    Cms.findOneAndUpdate({url:url},{$set:{deleteStatus:'active'}}).exec((err, data)=>{
        if(err){
            res.send({status:0, message:error});
        }else{
            res.send({status:1, message:'Update successfully', data:data});
        }
    });
}
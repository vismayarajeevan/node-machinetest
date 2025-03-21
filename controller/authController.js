const users = require('../model/userModel')


exports.registerController = async(req,res)=>{
    console.log("inside register controller");
    res.status(200).json('register')
    
}
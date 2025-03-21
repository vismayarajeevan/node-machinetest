const mongoose = require('mongoose')

CONNECTIONSTRING = process.env.MONGODBURL

mongoose.connect(CONNECTIONSTRING).then(res=>{
    console.log('Mongodb connected successfully');
    
}).catch(err=>{
    console.log('Mongodb connection failed');
    console.log(err);
    
    
})
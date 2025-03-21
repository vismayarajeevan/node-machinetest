const users = require('../model/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')


// nodemailer setup

const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user : process.env.NodemailerMail,
      pass: process.env.NodemailerPassword
    }
})


// register
exports.registerController = async(req,res)=>{
   try {

    const {userName,email,password} = req.body

    if(!userName || !email || !password){
        res.status(400).json('All fields are required')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json('Invalid email format')
    }

    const encryptedPassword = await bcrypt.hash(password,10)

    const otp = Math.floor(100000 + Math.random() * 900000);

    const existingUser = await users.findOne({email})

    if(existingUser){
        if(existingUser.verified){
            res.status(400).json({message:'User already registered and verified with this email'})

        }else{
          existingUser.otp =otp
          existingUser.password = encryptedPassword
          await existingUser.save()
        }
    }else{
        const newUser = new users({
            userName,
            email,
            password:encryptedPassword,
            otp
        })

        await newUser.save()
    }

    // sent otp

    await transport.sendMail({
        from:process.env.NodemailerMail,
      to: email,
      subject:'OTP Verification',
      text:`Your OTP for verification is: ${otp}`,
    })

    res.status(200).json({message:'OTP sent successfully'})



   } catch (error) {
    console.log("error during registration",error);
    
    res.status(500).json({ message: 'Failed to send OTP', error: error.message })
   }
    
}


// verify user
exports.verifyOtp = async (req,res)=>{
    try {
        const {email,otp} = req.body
        const existingUser = await users.findOne({email})

        if(!existingUser){
            res.status(400).json('user not found')
        }
        if(existingUser.otp !=otp){
            res.status(400).json('Invalid otp')
        }

        existingUser.verified = true
        existingUser.otp =''

        await existingUser.save()
        res.status(200).json({message:'User verified'})
        
    } catch (error) {
        res.status(500).json({message:"Failed to verify user"})
        console.log(error);
        
    }
}
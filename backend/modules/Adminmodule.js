const { ObjectID } = require("bson");
const  mongo  = require("../connect.js")
const  bcrypt  = require("bcrypt")
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const Joi = require("joi");
const nodemailer = require('nodemailer');
const { base64encode, base64decode } = require('nodejs-base64');

const checkPassword =(password,confirm_password)=>{
    return password!==confirm_password? false:true;
}
const toISOStringLocal=(d)=>{
    function z(n){return (n<10?'0':'') + n}
    return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' +
           z(d.getDate()) + 'T' + z(d.getHours()) + ':' +
           z(d.getMinutes()) + ':' + z(d.getSeconds());
            
  }

module.exports.getUser= async(req,res,next)=>{
    const id=req.params.id;
    try{
     getuserdetail = await mongo.selectedDB.collection("users").findOne({ _id: ObjectId(id) });
     res.send({user_details:getuserdetail});
    }catch(error){ 
        res.status(500).send(error);
    }
};

module.exports.login=async (req,res,next)=>{
    try{
        const validation = Joi.object({
            email: Joi.string().email().required(), 
            password: Joi.string().min(5).required(), 
         });

           const {error }= validation.validate(req.body);
           if(error){
            return  res.status(400).send({"msg":error.message});
           }
        //check user email already exists
        const checkUserexists = await mongo.selectedDB.collection("admin_users").findOne({ email:req.body.email });
        if(!checkUserexists){
            return  res.status(400).send({"msg":"Invalid credentials"});
        }  

        //password decrypt using bcrypt but by hash we cant decrypt
       const isValidpassword = await bcrypt.compare(req.body.password,checkUserexists.password);
       //validate password     
       if(!isValidpassword){
        return  res.status(400).send({"msg":"Incorrect Password"});
       }

       //Generate and send token as response
       const token = jwt.sign(checkUserexists,process.env.SECRET_KEY, { expiresIn:'100s' });
       return  res.status(200).send({"admin_token":token,'id':checkUserexists._id});
      }catch(error){
          res.status(500).send(error);
      }
   };
    
   module.exports.checKTokenexists=async (req,res,next)=>{
       
        let password_token=req.params.password_token; let currentDatetime = toISOStringLocal(new Date())+'Z';
        return res.status(200).send({"msg":"Token valid"});
      /*try{
            // Verifing the JWT token
            jwt.verify(password_token, process.env.SECRET_KEY, function(err, decoded) {
                if (err) {
                    return  res.status(200).send({"msg":"error expired"});
                }
            });
    
            if(currentDatetime>password_token){
                return res.status(200).send({"msg":"Token Expired"});
            }

            //token exists success
            return res.status(200).send({"msg":"Token exists"});
    
          }catch(error){
            return res.status(500).send(error);
          }*/
        
    };
    
       
  
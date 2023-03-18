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

module.exports.signup=async (req,res,next)=>{
    try{

        const validation = Joi.object({
            user_name: Joi.string().min(3).max(30).trim(true).required(),                        
            mobile_number: Joi.string().min(5).max(50).trim(true).required(), 
            email: Joi.string().email().min(5).max(50).trim(true).required(), 
            password: Joi.string().min(5).max(50).trim(true).required(), 
            confirm_password: Joi.string().min(5).max(50).trim(true).required(),    
            address: Joi.string().min(2).max(500).trim(true).required(),                        
            country: Joi.string().min(2).max(100).trim(true).required(),                        
            state: Joi.string().min(2).max(50).trim(true).required(),                        
            city: Joi.string().min(4).max(30).trim(true).required(),  
            pincode: Joi.string().min(4).max(30).trim(true).required(),                        
        });

           const {error }= validation.validate(req.body);
           if(error){
            return  res.status(400).send({"msg":error.message});
           }

        checkEmailExists = await mongo.selectedDB.collection("users").findOne({ email:req.body.email });
        if(checkEmailExists){
          return  res.status(400).send({"msg":"You are already a registered user"});
        }            
         const isSamePassword= checkPassword(req.body.password,req.body.confirm_password); 
         if(!isSamePassword){
            return  res.status(400).send({"msg":"passwords doesnt match"});
         }else{
             delete req.body.confirm_password;
         }
         //password encryption
          const randomString = await bcrypt.genSalt(10);  
          req.body.password = await bcrypt.hash(req.body.password,randomString);
         
          //save in DB  
          responseInserted = await mongo.selectedDB.collection("users").insertOne({...req.body});
          return  res.status(200).send({"msg":"Thanks for registering with us"});
      }catch(error){
          console.error(error);
          res.status(500).send(error);
      }
  
};


module.exports.signin=async (req,res,next)=>{
    try{
        //check user email already exists
        const checkUserexists = await mongo.selectedDB.collection("users").findOne({ email:req.body.email });
        if(!checkUserexists){
            return  res.status(400).send({"msg":"You are not a registered user. Please register to continue"});
        }  

        //password decrypt using bcrypt but by hash we cant decrypt
       const isValidpassword = await bcrypt.compare(req.body.password,checkUserexists.password);
       //validate password     
       if(!isValidpassword){
        return  res.status(400).send({"msg":"Incorrect Password"});
       }

       //Generate and send token as response
       const token = jwt.sign(checkUserexists,process.env.SECRET_KEY, { expiresIn:'100s' });
       return  res.status(200).send({"user_token":token,'user_id':checkUserexists._id,'user_name':checkUserexists.user_name});
      }catch(error){
         // console.error(error);
          res.status(500).send(error);
      }
    };

    module.exports.checkUser=async (req,res,next)=>{
    
        function toISOStringLocal(d) {
            function z(n){return (n<10?'0':'') + n}
            return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' +
                   z(d.getDate()) + 'T' + z(d.getHours()+2) + ':' +
                   z(d.getMinutes()) + ':' + z(d.getSeconds());
                    
          }
         function addHours(numOfHours, date = new Date()) {
            date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
            return date;
          }
             
       
        //console.log(req);
        try{
            
            const alreadyexists=(await mongo.selectedDB.collection("users").findOne(
                {
                    $and: [
                        {'email': req.body.email},
                    ]
                }
            ));
            if(!alreadyexists){
                return  res.status(400).send({"msg":"Invalid email.Check with Support Team or Register as new user"});
            }  
            
            
                //Generate and send token as response
                //const token = jwt.sign(alreadyexists,process.env.SECRET_KEY, { expiresIn:'1hr' });
    
                //password encryption
                const randomString = await bcrypt.genSalt(10);  
                const randomString_email = await bcrypt.hash(req.body.email,randomString);
                let encoded_token = base64encode(randomString_email);
                //console.log(randomString_email);
    
                 var datetime= toISOStringLocal(new Date())+'Z'; var expiry_datetime='';
                //console.log(datetime);
                
                const updatedData= await mongo.selectedDB.collection("users").updateOne(
                { _id: ObjectId(alreadyexists._id) },
                { $set:{ password_token : encoded_token, token_expiry:(datetime)  } },
                { returnDocument: "after" },   
                );
              
     
                    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            type: 'OAuth2',
                            user: 'saleem.mcstn@gmail.com',
                            clientId: '802969667608-jrvc1tso1bfcik3tmr9sddo8blavpf2n.apps.googleusercontent.com',
                            clientSecret: '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',
                            refreshToken: '1//043eA_7ZtJk3jCgYIARAAGAQSNgF-L9IrMmsSv9_j_Ap0MAVM_8S5U2hj4fNvDHYmxKTq0JoScuFK30VbmQ5Gd018RGfI1TbCtw',
                            accessToken: 'ya29.a0AeTM1iddrdOOhZZ9tjfVkgECu_HNdtHB5ZZSa1awh-ytWXZF5b46kdhFBF_YW8kJc8_GVDuKIPG7ft5bJZWhY-UWL6jkW-q3J8clFe6eCtGchJUDW5Vc9dTg2nZ_ReDk23O1AvI-9widNJJBdqoprICCpsYxaCgYKAZ8SARISFQHWtWOmeuQyz5KgKuZTMt3Q58yxUg0163',
                            }
                    });
                    
                    
                    var mail = {
                        from: "test@gmail.com",
                        to: "saleem.mcstn@gmail.com",
                        subject: "Guvi Forgot Password",
                        text: "Following is the link to reset your password,\n http://localhost:3000/Catalog/Resetpassword/"+encoded_token,
                        html: "<p>Following is the link to reset your password,</p><p>http://localhost:3000/Catalog/Resetpassword/"+encoded_token+"</p> <p>Best Regards,</p><p>Support Team,</p><p>Guvi</p>",
                    }
    
                  const mail_sent =  transporter.sendMail(mail, function(err, info) {
                        if (err) {
                           // console.log(err);
                        } else {
                            // see https://nodemailer.com/usage
                           // console.log("info.messageId: " + info.messageId);
                           // console.log("info.envelope: " + info.envelope);
                           // console.log("info.accepted: " + info.accepted);
                           // console.log("info.rejected: " + info.rejected);
                          //  console.log("info.pending: " + info.pending);
                          //  console.log("info.response: " + info.response);
                        }
                        transporter.close();
                    });
                    
    
                res.send({"msg":"Email has been sent with the reset password link. Thank you"});
        
          }catch(error){
             // console.error(error);
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
    
    module.exports.resetPassword=async (req,res,next)=>{
        console.log(req.body);
        try{
            //check token already exists
            
            const checktokenexists=(await mongo.selectedDB.collection("users").findOne(
                {
                    $and: [
                        {'password_token': req.body.password_token},
                    ]
                }
            ));
            if(!checktokenexists){
                return  res.status(400).send({"msg":"Not a valid token"});
            }  
            const randomString = await bcrypt.genSalt(10);  
            req.body.password = await bcrypt.hash(req.body.password,randomString);
            //update password
             await mongo.selectedDB.collection("users").updateOne(
                { _id: ObjectId(checktokenexists._id) },
                { $set:{ password_token : "", password:req.body.password, token_expiry:"" } },
                { returnDocument: "after" },   
                );
                res.send({"msg":"Password updated successfully"});
    
          }catch(error){
             // console.error(error);
              res.status(500).send(error);
          }
   }; 
   module.exports.updateUser=async (req,res,next)=>{
    
    try{
        const id=req.params.id;
        const updatedData= await mongo.selectedDB.collection("users").findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { ...req.body.user_details} },
        { returnDocument: "after" },   
        );
        res.send({"msg":'User details updated successfully'});
    }  catch(error){
        res.status(500).send(error);
    } 
       
    };

module.exports.listUsers=async(req,res,next)=>{
    try{

        list_user = await mongo.selectedDB.collection("users").find().toArray();
        res.send(list_user);
       }catch(error){ 
           res.status(500).send(error);
       }
};
  
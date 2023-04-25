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
                    
                    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            type: 'OAuth2',
                            user: 'saleem.mcstn@gmail.com',
                            clientId: '756870982380-rjrgcr23apf7bb30r5pgm40ii7ebe4av.apps.googleusercontent.com',
                            clientSecret: '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',
                            refreshToken: '1//04vZoxOg5nbcRCgYIARAAGAQSNgF-L9Ir8lUshFntuX2i8Wj1piFThpaT4y9mVYIvAAS6EXkqk_A5hfA7k_krhIxG16eDJWXYxw',
                            accessToken: 'ya29.a0Ael9sCO7Owwyb0xzmacg_1150t5jvfG0KzZ1_FYMzpzVdimTMe9CL85jEtxMLIu7Q4KvnpAHbcxDXGwcHS_4fpxwUC50sBbnHAQ3uOAqrhz91WRILnkCIvcnO-D5zcy7bEn4kKUYF8JHOMRp3P_qwkXDtrbiaCgYKAQwSARISFQF4udJh3YZMp57U0HwBnVsFvytzFQ0163',
                            }
                    });
                    
                    
                    var mail = {
                        from: "<info@itemcatalogue.com>Item Catalogue Welcome User",
                        to: req.body.email,
                        subject: "Guvi Item Catalog User Registration",
                        //text: "Dear "+req.body.user_name+", Thank you for registering with Item Catalogue. This message is to inform you that your account registration has been completed. We hope you enjoy the various services available on our website.Should you have any questions or comments, please contact at +012 345 6789",
                        html: "<b><img src='https://email.uplers.com/blog/wp-content/uploads/2017/08/ThankYou-Email-Engagement-Thumbnail.jpg' /><p>Dear "+req.body.user_name+",</p><p><br/>Thank you for registering with Item Catalogue. This message is to inform you that your account registration has been completed. We hope you enjoy the various services available on our website.</p><p>Should you have any questions or comments, please contact at +012 345 6789</p> <p><br/>Best Regards,<br/>Support Team,<br/>Item Catalogue,<br/>GUVI</p></b>",
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
                            clientId: '756870982380-rjrgcr23apf7bb30r5pgm40ii7ebe4av.apps.googleusercontent.com',
                            clientSecret: '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',
                            refreshToken: '1//04vZoxOg5nbcRCgYIARAAGAQSNgF-L9Ir8lUshFntuX2i8Wj1piFThpaT4y9mVYIvAAS6EXkqk_A5hfA7k_krhIxG16eDJWXYxw',
                            accessToken: 'ya29.a0Ael9sCO7Owwyb0xzmacg_1150t5jvfG0KzZ1_FYMzpzVdimTMe9CL85jEtxMLIu7Q4KvnpAHbcxDXGwcHS_4fpxwUC50sBbnHAQ3uOAqrhz91WRILnkCIvcnO-D5zcy7bEn4kKUYF8JHOMRp3P_qwkXDtrbiaCgYKAQwSARISFQF4udJh3YZMp57U0HwBnVsFvytzFQ0163',
                            }
                    });
                    
                    
                    var mail = {
                        from: "<info@itemcatalogue.com>Item Catalogue Forgot Password",
                        to: alreadyexists.email,
                        subject: "Guvi Item Catalog Forgot Password",
                        html: "<b><img src='https://media.istockphoto.com/id/1433523465/vector/the-man-forgot-her-personal-data-the-concept-of-a-web-screensaver-with-a-forgotten-password.jpg?s=612x612&w=0&k=20&c=GcLv47vXtzmi13gdXUPs0fqqmkFWd2sBS-lutdbYRJk=' /><p>Dear "+alreadyexists.user_name+",<p>Following is the link to reset your password,</p><p>http://localhost:3000/Resetpassword/"+encoded_token+"</p><p>Should you have any questions or comments, please contact at +012 345 6789</p> <p><br/>Best Regards,<br/>Support Team,<br/>Item Catalogue,<br/>GUVI</p></b>",
                     
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
  
const { ObjectID } = require("bson");
const  mongo  = require("../connect.js")
const { ObjectId } = require("mongodb");

module.exports.createEnquiry=async(req,res,next)=>{

    try{
    responseInserted = await mongo.selectedDB.collection("enquiries").insertOne(req.body.enquiry_details);
    res.send({"msg":'Enquiry created successfully'});
    }catch(error){
    console.error(error);
    res.status(500).send(error);
    }
};

module.exports.listEnquiries=async(req,res,next)=>{
    try{

        list_brand = await mongo.selectedDB.collection("enquiries").find().toArray();
        res.send(list_brand);
       }catch(error){ 
           res.status(500).send(error);
       }
};
    
module.exports.deleteEnquiry=async(req,res,next)=>{
        try{
            const id=req.params.id;
            const deletedData= await mongo.selectedDB.collection("enquiries")
            .remove({ _id: ObjectId(id) });
            res.send({"msg":'Enquiry deleted successfully'});
        }  catch(error){
            res.status(200).send(error);
        } 
    };
    

module.exports.getEnquiry= async(req,res,next)=>{
    const id=req.params.id;
    try{

     getbranddetail = await mongo.selectedDB.collection("enquiries").findOne({ _id: ObjectId(id) });
     res.send({enquiry_details:getbranddetail});
    }catch(error){ 
        res.status(500).send(error);
    }
};
const { ObjectID } = require("bson");
const  mongo  = require("../connect.js")
const { ObjectId } = require("mongodb");

module.exports.createBrand=async(req,res,next)=>{

    alreadyexists=(await mongo.selectedDB.collection("brand").findOne(
        {'brand_name': req.body.brand_details.brand_name},
    ));

    if(alreadyexists){
    res.send({"msg":'brand name already exists'});
    }else{

    try{
    responseInserted = await mongo.selectedDB.collection("brand").insertOne(req.body.brand_details);
    res.send({"msg":'brand created successfully'});
    }catch(error){
    console.error(error);
    res.status(500).send(error);
    }
    }
};

module.exports.listBrand=async(req,res,next)=>{
    try{

        list_brand = await mongo.selectedDB.collection("brand").find().sort({'brand_name' : 1}).toArray();
        res.send(list_brand);
       }catch(error){ 
           res.status(500).send(error);
       }
};

module.exports.updateBrand=async (req,res,next)=>{
    
    try{
        const id=req.params.id;
        const updatedData= await mongo.selectedDB.collection("brand").findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { ...req.body.brand_details} },
        { returnDocument: "after" },   
        );
        res.send({"msg":'brand updated successfully'});
    }  catch(error){
        res.status(500).send(error);
    } 
       
    };
    
module.exports.deleteBrand=async(req,res,next)=>{
        try{
            const id=req.params.id;
            const deletedData= await mongo.selectedDB.collection("brand")
            .remove({ _id: ObjectId(id) });
            res.send({"msg":'brand deleted successfully'});
        }  catch(error){
            res.status(200).send(error);
        } 
    };
    

module.exports.getBrand= async(req,res,next)=>{
    const id=req.params.id;
    console.log(id);
    try{

     getbranddetail = await mongo.selectedDB.collection("brand").findOne({ _id: ObjectId(id) });
     res.send({brand_details:getbranddetail});
    }catch(error){ 
        res.status(500).send(error);
    }
};

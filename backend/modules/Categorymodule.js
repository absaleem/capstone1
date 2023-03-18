const { ObjectID } = require("bson");
const  mongo  = require("../connect.js")
const { ObjectId } = require("mongodb");

module.exports.createCategory=async(req,res,next)=>{

    alreadyexists=(await mongo.selectedDB.collection("category").findOne(
        {'category_name': req.body.category_details.category_name},
    ));

    if(alreadyexists){
    res.send({"msg":'category name already exists'});
    }else{

    try{
    responseInserted = await mongo.selectedDB.collection("category").insertOne(req.body.category_details);
    res.send({"msg":'category created successfully'});
    }catch(error){
    console.error(error);
    res.status(500).send(error);
    }
    }
};

module.exports.listCategory=async(req,res,next)=>{
    try{

        list_category = await mongo.selectedDB.collection("category").find().sort({'category_name' : 1}).toArray();
        res.send(list_category);
       }catch(error){ 
           res.status(500).send(error);
       }
};

module.exports.updateCategory=async (req,res,next)=>{
    
    try{
        const id=req.params.id;
        const updatedData= await mongo.selectedDB.collection("category").findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { ...req.body.category_details} },
        { returnDocument: "after" },   
        );
        res.send({"msg":'category updated successfully'});
    }  catch(error){
        res.status(500).send(error);
    } 
       
    };
    
module.exports.deleteCategory=async(req,res,next)=>{
        try{
            const id=req.params.id;
            const deletedData= await mongo.selectedDB.collection("category")
            .remove({ _id: ObjectId(id) });
            res.send({"msg":'category deleted successfully'});
        }  catch(error){
            res.status(200).send(error);
        } 
    };
    

module.exports.getCategory= async(req,res,next)=>{
    const id=req.params.id;
    console.log(id);
    try{

     getcategorydetail = await mongo.selectedDB.collection("category").findOne({ _id: ObjectId(id) });
     res.send({category_details:getcategorydetail});
    }catch(error){ 
        res.status(500).send(error);
    }
};

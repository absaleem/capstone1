const { ObjectID } = require("bson");
const  mongo  = require("../connect.js")
const { ObjectId } = require("mongodb");

module.exports.createSubcategory=async(req,res,next)=>{

    alreadyexists=(await mongo.selectedDB.collection("sub_category").findOne(
        {'sub_category_name': req.body.sub_category_details.sub_category_name},
    ));

    if(alreadyexists){
    res.send({"msg":'sub category name already exists'});
    }else{

    try{
    responseInserted = await mongo.selectedDB.collection("sub_category").insertOne(req.body.sub_category_details);
    res.send({"msg":'sub category created successfully'});
    }catch(error){
    console.error(error);
    res.status(500).send(error);
    }
    }
};

module.exports.listSubcategory=async(req,res,next)=>{
    try{
    listsubcategory = await mongo.selectedDB.collection("sub_category").aggregate(
        [
         {
             $addFields: {
               category_id: {
                 $toObjectId: "$category_id"
               }
             }
           },
           {
             $lookup: {
               from: "category",
               localField: "category_id",
               foreignField: "_id",
               as: "category"
             }
           }, {
             $unwind:"$category"
              }, 
        ]
    ).sort({'category._id' : 1}).toArray();
     res.send(listsubcategory);
    
    }catch(error){ 
        res.status(500).send(error);
    }
};

module.exports.updateSubcategory=async (req,res,next)=>{
    
    try{
        const id=req.params.id;
        const updatedData= await mongo.selectedDB.collection("sub_category").findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { ...req.body.sub_category_details} },
        { returnDocument: "after" },   
        );
        res.send({"msg":'sub category updated successfully'});
    }  catch(error){
        res.status(500).send(error);
    } 
       
    };
    
module.exports.deleteSubcategory=async(req,res,next)=>{
        try{
            const id=req.params.id;
            const deletedData= await mongo.selectedDB.collection("sub_category")
            .remove({ _id: ObjectId(id) });
            res.send({"msg":'sub category deleted successfully'});
        }  catch(error){
            res.status(200).send(error);
        } 
    };
    

module.exports.getSubcategory= async(req,res,next)=>{
    const id=req.params.id;
    console.log(id);
    try{

     getcategorydetail = await mongo.selectedDB.collection("sub_category").findOne({ _id: ObjectId(id) });
     res.send({sub_category_details:getcategorydetail});
    }catch(error){ 
        res.status(500).send(error);
    }
};

module.exports.getSubcatlist= async(req,res,next)=>{
  try{
    list_category = await mongo.selectedDB.collection("category").find().sort({'category_name' : 1}).toArray();
    for(var i=0;i<list_category.length;i++){
        getcategorydetail = await mongo.selectedDB.collection("sub_category").find({category_id:list_category[i]['_id']});
      }
  
    res.send(list_category);
  }catch(error){ 
      res.status(500).send(error);
  }
};

module.exports.getSubcategorybycategory= async(req,res,next)=>{
    try{
    
        listsubcategory = await mongo.selectedDB.collection("sub_category").aggregate([
            
                {
                    $addFields: {
                      category_id: {
                        $toObjectId: "$category_id"
                      }
                    }
                  },
                  {
                    $lookup: {
                      from: "category",
                      localField: "category_id",
                      foreignField: "_id",
                      as: "category"
                    }
                  }, {
                    $unwind:"$category"
                     }, 
                     {$sort: {category_id: 1}}

               /*{
                $group:{
                    _id:"$category_id",
                    total : {$sum:1},
                    sub_category_details: {$addToSet: {$concat:["$category_id", "?", "$sub_category_name"]}}
                    }
                },*/
                
            ]
            
            ).toArray();
         res.send(listsubcategory);
        
        }catch(error){ 
            res.status(200).send(error);
        }
};   

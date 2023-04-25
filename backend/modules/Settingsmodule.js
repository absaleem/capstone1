const { ObjectID } = require("bson");
const  mongo  = require("../connect.js")
const { ObjectId } = require("mongodb");

module.exports.createSettings=async(req,res,next)=>{

    try{
    let array_products=[];    
    let settings_details = req.body.settings_details; let home_featured_products=settings_details.home_featured_products;
    for(var i=0;i<home_featured_products.length;i++){
        array_products.push(ObjectId(home_featured_products[i]));
    }
    //console.log("products="+array_products);
    responseInserted = await mongo.selectedDB.collection("settings").insertOne(req.body.settings_details);
    res.send({"msg":'settings created successfully'});
    }catch(error){
    //console.error(error);
    res.status(500).send(error);
    }
};

module.exports.listSettings=async(req,res,next)=>{
    try{

        list_category = await mongo.selectedDB.collection("settings").find().sort({'_id' : 1}).toArray();
        res.send(list_category);
       }catch(error){ 
           res.status(500).send(error);
       }
};

module.exports.listFeaturedsettings=async(req,res,next)=>{
    try{
        listFeaturedsettings = await mongo.selectedDB.collection("settings").aggregate([
              {
                $lookup: {
                  from: "product",
                  localField: "home_featured_products",
                  foreignField: "_id",
                  as: "products"
                }
              }, {
                $unwind:"$products"
                 },
                 {
                 $lookup: {
                  from: "product_price",
                  localField: "home_featured_products",
                  foreignField: "product_id",
                  as: "productsprice"
                 }
                }, 
                 {
                $unwind:"$productsprice"
                 },
                 {   
                  $project:{
                      _id: 1,
                      product_id: "$products._id",
                      product_name: "$products.product_name",
                      product_image: "$productsprice.product_image",
                  },
              }, 
        ]).toArray();
        res.send(listFeaturedsettings);
        }catch(error){ 
            res.status(500).send(error);
        }
        
    /*try{
        listFeaturedsettings = await mongo.selectedDB.collection("settings").aggregate([
              {
                $lookup: {
                  from: "product",
                  localField: "home_featured_products",
                  foreignField: "_id",
                  as: "products"
                }
              }, {
                $unwind:"$products"
                 },
                 {   
                  $project:{
                      _id: 1,
                      product_id: "$products._id",
                      product_name: "$products.product_name",
                  },
              }, 
        ]).toArray();
        res.send(listFeaturedsettings);
        }catch(error){ 
            res.status(500).send(error);
        }*/
};

module.exports.updateSettings=async (req,res,next)=>{
    
    try{
    const id=req.params.id;
    let array_products=[];    
    let settings_details = req.body.settings_details; let home_featured_products=settings_details.home_featured_products;
    for(var i=0;i<home_featured_products.length;i++){
        array_products.push(ObjectId(home_featured_products[i]));
    }
    req.body.settings_details.home_featured_products=array_products;
   
        const updatedData= await mongo.selectedDB.collection("settings").findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { ...req.body.settings_details} },
        { returnDocument: "after" },   
        );
        res.send({"msg":'settings updated successfully'});
    }  catch(error){
        res.status(500).send(error);
    } 
       
    };
    
module.exports.deleteSettings=async(req,res,next)=>{
        try{
            const id=req.params.id;
            const deletedData= await mongo.selectedDB.collection("settings")
            .remove({ _id: ObjectId(id) });
            res.send({"msg":'settings deleted successfully'});
        }  catch(error){
            res.status(200).send(error);
        } 
    };
    

module.exports.getSettings= async(req,res,next)=>{
    const id=req.params.id;
//    console.log(id);
    try{

     getcategorydetail = await mongo.selectedDB.collection("settings").findOne({ _id: ObjectId(id) });
     res.send({settings_details:getcategorydetail});
    }catch(error){ 
        res.status(500).send(error);
    }

};

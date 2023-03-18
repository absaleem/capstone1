const { ObjectID } = require("bson");
const  mongo  = require("../connect.js")
const { ObjectId } = require("mongodb");

module.exports.createProduct=async(req,res,next)=>{

    alreadyexists=(await mongo.selectedDB.collection("product").findOne(
        {'product_name': req.body.product_details.product_name},
    ));

    if(alreadyexists){
    res.send({"msg":'product name already exists'});
    }else{

    try{
    responseInserted = await mongo.selectedDB.collection("product").insertOne(req.body.product_details);
    res.send({"msg":'product created successfully'});
    }catch(error){
    res.status(500).send(error);
    }
    }
};
module.exports.createProductprice=async(req,res,next)=>{
  try{
  responseInserted = await mongo.selectedDB.collection("product_price").insertOne(req.body.product_details);
  res.send({"msg":'Price details created successfully'});
  }catch(error){
  res.status(500).send(error);
  }
};

module.exports.listProduct=async(req,res,next)=>{
    try{

        listProducts = await mongo.selectedDB.collection("product").find().sort({'product_name' : 1}).toArray();
        res.send(listProducts);
       }catch(error){ 
           res.status(500).send(error);
       }
};

module.exports.updateProduct=async (req,res,next)=>{
    
    try{
        const id=req.params.id;
        const updatedData= await mongo.selectedDB.collection("product").findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { ...req.body.product_details} },
        { returnDocument: "after" },   
        );
        res.send({"msg":'product updated successfully'});
    }  catch(error){
        res.status(500).send(error);
    } 
       
    };

    module.exports.updateProductprice=async(req,res,next)=>{
      try{
        const id=req.params.id;
        const product_id = new ObjectId(req.body.product_details.product_id);
        const updatedData= await mongo.selectedDB.collection("product_price").findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: {
            product_id: product_id,
            product_image: req.body.product_details.product_image,
            product_price: req.body.product_details.product_price,
            product_discount_price: req.body.product_details.product_discount_price,
            sub_cat_id:req.body.product_details.sub_cat_id,
        
        } },
        { returnDocument: "after" },   
        );
        res.send({"msg":'Price details updated successfully'});
      }catch(error){
      res.status(500).send(error);
      }
    };

    module.exports.listProductprice=async(req,res,next)=>{
      try{
        listproductprice = await mongo.selectedDB.collection("product_price").aggregate([
            {
              $addFields: {
                product_id: {
                  $toObjectId: "$product_id"
                }
              }
            },  
            {
              $lookup: {
                from: "product",
                localField: "product_id",
                foreignField: "_id",
                as: "products"
              }
            }, {
              $unwind:"$products"
               },
               {   
                  $project:{
                      _id: 1,
                      product_id: 1,
                      product_name: 1,
                      product_image: 1,
                      product_price: 1,
                      product_discount_price: 1,
                      product_id: "$products._id",
                      product_name: "$products.product_name",
                  },
              }, 
      ]).toArray();
  
      res.send(listproductprice)
    }catch(error){ 
             res.status(500).send(error);
         }
     };

     module.exports.getProductprice= async(req,res,next)=>{
      const id=req.params.id;
      try{
  
       getcategorydetail = await mongo.selectedDB.collection("product_price").findOne({ _id: ObjectId(id) });
       res.send({product_details:getcategorydetail});
      }catch(error){ 
          res.status(500).send(error);
      }
  };
  
      module.exports.deleteProductprice=async(req,res,next)=>{
      try{
          const id=req.params.id;
          const deletedData= await mongo.selectedDB.collection("product_price")
          .remove({ _id: ObjectId(id) });
          res.send({"msg":'product price details deleted successfully'});
      }  catch(error){
          res.status(200).send(error);
      } 
  };    

module.exports.deleteProduct=async(req,res,next)=>{
        try{
            const id=req.params.id;
            const deletedData= await mongo.selectedDB.collection("product")
            .remove({ _id: ObjectId(id) });
            res.send({"msg":'product deleted successfully'});
        }  catch(error){
            res.status(200).send(error);
        } 
    };
    

module.exports.getProduct= async(req,res,next)=>{
    const id=req.params.id;
    try{
     getbranddetail = await mongo.selectedDB.collection("product").findOne({ _id: ObjectId(id) });
     res.send({product_details:getbranddetail});
    }catch(error){ 
        res.status(500).send(error);
    }
};
module.exports.getProductdetail= async(req,res,next)=>{
  const id=req.params.id;
  try{
    listProducts = await mongo.selectedDB.collection("product").aggregate([
    
      {$match: { _id: ObjectId(id) }}, 
         {
            $lookup: {
              from: "product_price",
              localField: "_id",
              foreignField: "product_id",
              as: "pricess"
            }
          }, {
            $unwind:"$pricess"
             },
          
             {   
                $project:{
                    _id: 1,
                    product_id: 1,
                    product_name: 1,
                    product_description:1,
                    product_specification:1,
                    product_image: "$pricess.product_image",
                    product_price: "$pricess.product_price",
                    product_discount_price: "$pricess.product_discount_price",
                    sub_cat_id:"$pricess.sub_cat_id",
                },
            },
    ]).toArray(); 
    res.send({product_details:listProducts});
  }catch(error){ 
      res.status(500).send(error);
  }
};

module.exports.getBrandproducts=async(req,res,next)=>{
    const id=req.params.id; var resultSet = [];
    try{
        listBrandproducts = await mongo.selectedDB.collection("product").aggregate([
            {$match: { "brand_id": id }}, 
              {
                $addFields: {
                  brand_id: {
                    $toObjectId: "$brand_id"
                  }
                }
              },  
              {
                $lookup: {
                  from: "product_price",
                  localField: "_id",
                  foreignField: "product_id",
                  as: "pricess"
                }
              }, {
                $unwind:"$pricess"
                 },
              
              {
                $lookup: {
                  from: "brand",
                  localField: "brand_id",
                  foreignField: "_id",
                  as: "brands"
                }
              }, {
                $unwind:"$brands"
                 },
                 {   
                    $project:{
                        _id: 1,
                        brand_id: "$brands._id",
                        brand_name: "$brands.brand_name",
                        product_id: 1,
                        product_name: 1,
                        product_description:1,
                        product_specification:1,
                        product_image: "$pricess.product_image",
                        product_price: "$pricess.product_price",
                        product_discount_price: "$pricess.product_discount_price",
                        sub_cat_id:"$pricess.sub_cat_id",
                    },
                }, 
        ]).toArray();
        
        resultSet['0']=listBrandproducts;  
        
          listProductreviews = await mongo.selectedDB.collection("product").aggregate([
            {$match: { "brand_id": id }}, 
              {
                $addFields: {
                  brand_id: {
                    $toObjectId: "$brand_id"
                  }
                }
              },  
              {
                $lookup: {
                  from: "product_review",
                  localField: "_id",
                  foreignField: "product_id",
                  as: "reviews"
                }
              }, 
              {
                $unwind:"$reviews"
              },
            {
                $group: {
                  _id: "$reviews.product_id",
                  count:{$sum:1},
                  ratingAvg: {
                    $avg: "$reviews.rating"
                  }
                }
            },
        ]).toArray();
        
        resultSet['1']=listProductreviews;  
        
        
        res.send(resultSet);
        }catch(error){ 
            res.status(500).send(error);
        }
};

module.exports.searchbySubcategory=async(req,res,next)=>{
    let sub_cat_id=req.body.search_details.sub_cat_id;
    let result = Array.isArray(sub_cat_id);
    if (sub_cat_id.indexOf(',') <0) {
    // if(result === false){
        try{
        listSearchproducts1 = await mongo.selectedDB.collection("product_price").aggregate([
              {$match: { "sub_cat_id": sub_cat_id }},
              {
                $lookup: {
                  from: "product",
                  localField: "product_id",
                  foreignField: "_id",
                  as: "product"
                }
              }, {
                $unwind:"$product"
                 },
              
                {   
                    $project:{
                        //_id: 1,
                        _id: "$product._id",
                        product_name: "$product.product_name",
                        product_description:"$product.product_description",
                        product_specification:"$product.product_specification",
                        product_image: 1,
                        product_price:1,
                        product_discount_price:1,
                        sub_cat_id:1
                    },
                }, 
        ]).toArray();
        res.send(listSearchproducts1);
        }catch(error){ 
            res.status(500).send(error);
        }
               
     }else{         
    var array_search = sub_cat_id.split(',');

    try{
        listSearchproducts2 = await mongo.selectedDB.collection("product_price").aggregate([
              {
               
                                    
                 
                 "$match": { 
                     $and : [{ 'sub_cat_id' : { $exists: true, $in: [ array_search ]}} ]  }
                     //$and : [{ 'sub_cat_id' : { $exists: true, $in: [ '63cb4e6cce53e96e3f651ea4','63cba6e36a0f4077b249b52a']}} ]  }
              },
              {
                $lookup: {
                  from: "product",
                  localField: "product_id",
                  foreignField: "_id",
                  as: "product"
                }
              }, {
                $unwind:"$product"
                 },
              
                {   
                    $project:{
                        _id: 1,
                        product_id: "$product._id",
                        product_name: "$product.product_name",
                        product_description:"$product.product_description",
                        product_specification:"$product.product_specification",
                        product_image: 1,
                        product_price:1,
                        product_discount_price:1,
                        sub_cat_id:1
                    },
                }, 
        ]).toArray();
        res.send(listSearchproducts2);
        }catch(error){ 
            res.status(500).send(error);
        }
     }   
};

module.exports.createProductreview=async(req,res,next)=>{
    alreadyexists=(await mongo.selectedDB.collection("product_review").findOne(
        {'product_id': (req.body.review_details.product_id),'user_id':ObjectId(req.body.review_details.user_id)},
    ));

    if(alreadyexists){
    res.send({"msg":'Review already given'});
    }else{
        let review_details={'product_id': (req.body.review_details.product_id),'user_id':ObjectId(req.body.review_details.user_id),
                            'rating':req.body.review_details.rating,'description':req.body.review_details.description,'created_datetime':new Date(Date.now()).toISOString()};
    try{
    responseInserted = await mongo.selectedDB.collection("product_review").insertOne(review_details);
    res.send({"msg":'Review submitted successfully'});
    }catch(error){
    console.error(error);
    res.status(500).send(error);
    }
    }
};

module.exports.getProductreview=async(req,res,next)=>{
    const product_id=req.params.id; var resultSet = [];
    
    try{
        
        listProductsreview = await mongo.selectedDB.collection("product_review").aggregate([
            {$match: { "product_id": product_id }}, 
            {
              $addFields: {
                product_id: {
                  $toObjectId: "$product_id"
                },
                
              }
            },  
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "users"
              }
            }, {
              $unwind:"$users"
               },       
               {   
                $project:{
                    _id: 1,
                    rating: 1,
                    description:1,
                    user_id: "$users._id",
                    user_name: "$users.user_name",
                    profile_picture_link:"$users.profile_picture_link",
                    created_datetime:1
                },
            }, {
              $sort: {
                created_datetime: -1
              }
            }
         ])
         .toArray();
         
         resultSet['0']=listProductsreview;         
         
         listProductsratings = await mongo.selectedDB.collection("product_review").aggregate([
            {$match: { "product_id": product_id }}, 
            {
              $addFields: {
                product_id: {
                  $toObjectId: "$product_id"
                },
                
              }
            },
            {
                $group: {
                  _id: 1,
                  count:{$sum:1},
                  ratingAvg: {
                    $avg: "$rating"
                  }
                }
            },
         ])
         .toArray();
         
         resultSet['1']=listProductsratings;         
    
        res.send(resultSet);
        }catch(error){ 
            res.status(500).send(error);
        }
};

module.exports.getProductrating=async(req,res,next)=>{
    const product_id=req.params.id;
    
    try{
        
        listProductsratings = await mongo.selectedDB.collection("product_review").aggregate([
            {$match: { "product_id": product_id }}, 
            {
              $addFields: {
                product_id: {
                  $toObjectId: "$product_id"
                },
                
              }
            },
            {   
                $project:{
                    _id: 1,
                    product_id: 1,
                    product_name: 1,
                },
            },
            {
                $group: {
                  _id: 1,
                  count:{$sum:1},
                  ratingAvg: {
                    $avg: "$rating"
                  }
                }
            },
         ])
         .toArray();
        res.send(listProductsratings);
        }catch(error){ 
            res.status(500).send(error);
        }
};

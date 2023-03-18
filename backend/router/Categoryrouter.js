const express=require("express");
const router=express.Router();
const Categorymodule= require("../modules/Categorymodule");
const Productmodule= require("../modules/Productmodule");
const Brandmodule= require("../modules/Brandmodule");
const Subcategorymodule = require("../modules/Subcategorymodule");
const Settingsmodule = require("../modules/Settingsmodule");
const Usermodule = require("../modules/Usermodule");
const Adminmodule= require("../modules/Adminmodule");
const Enquirymodule = require("../modules/Enquirymodule");

router.post("/createBrand",Brandmodule.createBrand);
router.get("/listBrand",Brandmodule.listBrand);
router.get("/getBrand/:id",Brandmodule.getBrand);
router.put("/updateBrand/:id",Brandmodule.updateBrand);
router.delete("/deleteBrand/:id",Brandmodule.deleteBrand);


router.post("/createCategory",Categorymodule.createCategory);
router.get("/listCategory",Categorymodule.listCategory);
router.get("/getCategory/:id",Categorymodule.getCategory);
router.put("/updateCategory/:id",Categorymodule.updateCategory);
router.delete("/deleteCategory/:id",Categorymodule.deleteCategory);

router.post("/createSubcategory",Subcategorymodule.createSubcategory);
router.get("/listSubcategory",Subcategorymodule.listSubcategory);
router.get("/getSubcategory/:id",Subcategorymodule.getSubcategory);
router.get("/getSubcategorybycategory",Subcategorymodule.getSubcategorybycategory);
router.put("/updateSubcategory/:id",Subcategorymodule.updateSubcategory);
router.delete("/deleteSubcategory/:id",Subcategorymodule.deleteSubcategory);
router.get("/getSubcatlist",Subcategorymodule.getSubcatlist);

router.post("/createProduct",Productmodule.createProduct);
router.get("/listProduct",Productmodule.listProduct);
router.get("/getProduct/:id",Productmodule.getProduct);
router.put("/updateProduct/:id",Productmodule.updateProduct);
router.delete("/deleteProduct/:id",Productmodule.deleteProduct);
router.get("/getProductdetail/:id",Productmodule.getProductdetail);
router.get("/getBrandproducts/:id",Productmodule.getBrandproducts);
router.post("/createProductreview",Productmodule.createProductreview);
router.get("/getProductreview/:id",Productmodule.getProductreview);
router.get("/getProductrating/:id",Productmodule.getProductrating);
router.post("/searchbySubcategory",Productmodule.searchbySubcategory);


router.post("/createProductprice",Productmodule.createProductprice);
router.get("/listProductprice",Productmodule.listProductprice);
router.get("/getProductprice/:id",Productmodule.getProductprice);
router.put("/updateProductprice/:id",Productmodule.updateProductprice);


router.post("/createSettings",Settingsmodule.createSettings);
router.get("/listSettings",Settingsmodule.listSettings);
router.get("/getSettings/:id",Settingsmodule.getSettings);
router.put("/updateSettings/:id",Settingsmodule.updateSettings);
router.delete("/deleteSettings/:id",Settingsmodule.deleteSettings);
router.get("/listFeaturedsettings",Settingsmodule.listFeaturedsettings);

router.post("/user/signup",Usermodule.signup);
router.post("/user/signin",Usermodule.signin);
router.get("/user/getUser/:id",Usermodule.getUser);
router.put("/user/updateUser/:id",Usermodule.updateUser);
router.post("/user/checkUser",Usermodule.checkUser);
router.post("/user/resetPassword",Usermodule.resetPassword);
router.get("/user/checKTokenexists/:password_token",Usermodule.checKTokenexists);
router.get("/user/listUsers",Usermodule.listUsers);


router.post("/admin/login",Adminmodule.login);
router.post("/admin/enquiry/createEnquiry",Enquirymodule.createEnquiry);
router.get("/admin/enquiry/listEnquiries",Enquirymodule.listEnquiries);


module.exports=  router; 
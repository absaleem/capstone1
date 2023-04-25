import React,{useState} from "react";
import Footer from "./Components/Footer"
import Navbar from "./Components/Navbar";
import Topbar from "./Components/Topbar";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register(){
    let formValues={
        user_name:"",
        mobile_number:"",
        address:"",
        country:"",
        state:"",
        city:"",
        pincode:"",
        email:"",
        password:"",
        confirm_password:"",
        error:{
            user_name:"",
            mobile_number:"",
            address:"",
            country:"",
            state:"",
            city:"",
            pincode:"",
            email:"",
            password:"",
            confirm_password:""
        }
      }
    
   const handleChange =(e)=>{
     let error= { ...formValues.error };
     if(e.target.value === ""){
       error[e.target.name]=`${e.target.placeholder} is required`;
     }else{
       error[e.target.name]=""; 
     }
     setFormdata({...formData, [e.target.name]:e.target.value, error});
   }
   const [formData,setFormdata]=useState(formValues); 
   
   const handleSubmit= async (e)=>{
     e.preventDefault();
   
     const errorkeys=Object.keys(formData).filter((key)=>{
       if(formData[key] === "" && key!=='error'){
         return key;
       }
     });
 
     if(errorkeys.length>0){
       alert('pls fill all the fields');
     }else if(formData.password!==formData.confirm_password){
        alert('Password and Confirm Password doesnt match');
    }else{
       try {
       const response=await axios.post("https://item-catalog-webservice.onrender.com/Catalog/user/signup", {
        user_name:formData.user_name,
        mobile_number:formData.mobile_number,
        address:formData.address,
        country:formData.country,
        state:formData.state,
        city:formData.city,
        pincode:formData.pincode,
        email:formData.email,
        password:formData.password,
        confirm_password:formData.confirm_password,
       }); 
       setFormdata(formValues);
       toast(response.data.msg);    
     }catch(error){
        toast(error.response.data.msg);  
     }
     } 
   }
 
        
    return (
        <>
         <Topbar/>
         <Navbar/>
         <div class="container-fluid">
         <div><ToastContainer /></div>
        <div class="row px-xl-5">
            <div class="col-lg-12">
                <h5 class="section-title position-relative text-uppercase mb-3"><span class="bg-secondary pr-3">User Registration</span></h5>
                <div class="bg-light p-30 mb-5">
                    <form onSubmit={(e)=>handleSubmit(e)}>
                         
                        <div class="row">
                           <div class="col-md-6 form-group">
                           <label for="product_name">User name</label>
                            <input className="form-control" id="user_name" name="user_name" type="text" value={formData.user_name}  onChange={(e) => handleChange(e)}  placeholder="user name" required/>
                            <span style={{color:"red"}}> {formData.error.user_name}</span>
                            <p className="help-block text-danger"></p>
                           </div>
                           <div class="col-md-6 form-group">
                           <label for="product_name">Mobile number</label>
                            <input className="form-control" id="mobile_number" name="mobile_number" type="text" value={formData.mobile_number}  onChange={(e) => handleChange(e)}  placeholder="mobile number" required/>
                            <span style={{color:"red"}}> {formData.error.mobile_number}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div class="col-md-6 form-group">
                            <label for="product_name">Address</label>
                            <textarea className="form-control" id="address" name="address" type="text" value={formData.address}  onChange={(e) => handleChange(e)}  placeholder="address" required></textarea>
                            <span style={{color:"red"}}> {formData.error.address}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div class="col-md-6 form-group">
                            <label for="product_name">Country</label>
                            <input className="form-control" id="country" name="country" type="text" value={formData.country}  onChange={(e) => handleChange(e)}  placeholder="country" required/>
                            <span style={{color:"red"}}> {formData.error.country}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div class="col-md-6 form-group">
                            <label for="product_name">State</label>
                            <input className="form-control" id="state" name="state" type="text" value={formData.state}  onChange={(e) => handleChange(e)}  placeholder="state" required/>
                            <span style={{color:"red"}}> {formData.error.state}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div class="col-md-6 form-group">
                           <label for="product_name">City</label>
                            <input className="form-control" id="city" name="city" type="text" value={formData.city}  onChange={(e) => handleChange(e)}  placeholder="city" required/>
                            <span style={{color:"red"}}> {formData.error.city}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div class="col-md-6 form-group">
                            <label for="product_name">Pin code</label>
                            <input className="form-control" id="pincode" name="pincode" type="text" value={formData.pincode}  onChange={(e) => handleChange(e)}  placeholder="pincode" required/>
                            <span style={{color:"red"}}> {formData.error.pincode}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div class="col-md-6 form-group">
                            <label for="product_name">Email</label>
                            <input className="form-control" id="email" name="email" type="email" value={formData.email}  onChange={(e) => handleChange(e)}  placeholder="email" required/>
                            <span style={{color:"red"}}> {formData.error.email}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div class="col-md-6 form-group">
                            <label for="product_name">Password</label>
                            <input className="form-control" id="password" name="password" type="password" value={formData.password}  onChange={(e) => handleChange(e)}  placeholder="password" required/>
                            <span style={{color:"red"}}> {formData.error.password}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div class="col-md-6 form-group">
                            <label for="product_name">Confirm Password</label>
                            <input className="form-control" id="confirm_password" name="confirm_password" type="password" value={formData.confirm_password}  onChange={(e) => handleChange(e)}  placeholder="confirm password" required/>
                            <span style={{color:"red"}}> {formData.error.confirm_password}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                        </div>
                        
                        <div>
                        <button className="btn btn-primary btn-lg" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="col-lg-5 mb-5">
             
            </div>
        </div>
    </div>
       <Footer/>
   
    </>
    );
}

export default Register;
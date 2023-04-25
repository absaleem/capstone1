import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbaradmin from "../frontend/Components/Navbaradmin";
import Footeradmin from "../frontend/Components/Footeradmin"

function BackendLogin(){
    let formValues={
        email:"",
        password:"",
        error:{
            email:"",
            password:"",
        }
      }
    const navigate = useNavigate();
    const admin_token = localStorage.getItem("admin_token");
    if(admin_token){
        navigate('/admin/Dashboard');
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
       return false;
     });
 
     if(errorkeys.length>0){
       toast('pls fill all the fields');  
     }else{
       try {
       const response=await axios.post("https://item-catalog-webservice.onrender.com/Catalog/admin/login", {
        email:formData.email,
        password:formData.password,
       }); 
       setFormdata(formValues);
       localStorage.setItem("admin_token",response.data.token);
       navigate(`/admin/Dashboard`); 
     }catch(error){
        toast(error.response.data.msg);  
     }
     } 
   }

   useEffect(() => {
    if(admin_token){
      navigate('/admin/Dashboard');
  }

   }); 
 
        
    return (
        <>
         <Navbaradmin/>
         <div className="container-fluid">
         <div><ToastContainer /></div>
         <div className="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
            <div className="col-lg-4">
                <a href={"/"} className="text-decoration-none">
                    <span className="h1 text-uppercase text-primary bg-dark px-2">Item</span>
                    <span className="h1 text-uppercase text-dark bg-primary px-2 ml-n1">Catalogue</span>
                </a>
            </div>
          </div>  
        <div className="row px-xl-5">
            <div className="col-lg-12">
                <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Admin Login</span></h5>
                <div className="bg-light p-30 mb-5">
                    <form onSubmit={(e)=>handleSubmit(e)}>
                         
                        <div className="row">
                           <div className="col-md-8 form-group">
                            <label for="product_name">Email</label>
                            <input className="form-control" id="email" name="email" type="email" value={formData.email}  onChange={(e) => handleChange(e)}  placeholder="email" required/>
                            <span style={{color:"red"}}> {formData.error.email}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div className="col-md-8 form-group">
                            <label for="product_name">Password</label>
                            <input className="form-control" id="password" name="password" type="password" value={formData.password}  onChange={(e) => handleChange(e)}  placeholder="password" required/>
                            <span style={{color:"red"}}> {formData.error.password}</span>
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
    <Footeradmin/>
    </>
    );
}

export default BackendLogin;
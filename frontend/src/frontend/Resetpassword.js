import React,{useState,useEffect} from "react";
import Footer from "./Components/Footer"
import Navbar from "./Components/Navbar";
import Topbar from "./Components/Topbar";
import axios from "axios";
import { Link, useNavigate,useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Forgotpassword(){
   const navigate = useNavigate();
   const params = useParams();
   let formValues={
    password:"",
  }
  const [formData,setFormdata]=useState(formValues); 
   useEffect(() => {
       const token=params.token;  setFormdata({...formData, password_token:token}); //console.log(token); console.log(formData);
       async function getData(token){
          try{
           var res= await axios.get(`http://localhost:3001/Catalog/user/checKTokenexists/${token}`); 
           console.log(res);
          }
          catch(error){
           toast('Password link expired'); 
          setTimeout(() => {
           navigate('/Forgotpassword'); //this.props.navigation.navigate('Login')
       }, 5000);
          } 
       }    
       
           var res=  getData(token);//call user data when loading the file   
      
    },[]);
    
   const handleChange =(e)=>{
     setFormdata({...formData, [e.target.name]:e.target.value});
   }
   
   const handleSubmit= async (e)=>{
     e.preventDefault();
   
       try {
         const response = await axios.post("http://localhost:3001/Catalog/user/resetPassword",{...formData});
         if(response){
               toast(response.data.msg); 
               setTimeout(() => {
                navigate('/Login'); //this.props.navigation.navigate('Login')
            }, 5000);  //5000 milliseconds
         }
        } catch (error) {
         toast(error.response.data.msg);            
     } 
   }
 
        
    return (
        <>
         <Topbar/>
         <Navbar/>
         <div className="container-fluid">
         <div><ToastContainer /></div>
        <div className="row px-xl-5">
            <div className="col-lg-12">
                <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Reset Your Password</span></h5>
                <div className="bg-light p-30 mb-5">
                    <form onSubmit={(e)=>handleSubmit(e)}>
                         
                        <div className="row">
                           <div className="col-md-8 form-group">
                            <label for="product_name">Password</label>
                            <input className="form-control" id="password" name="password" type="password" value={formData.password}  onChange={(e) => handleChange(e)}  placeholder="password" required/>
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

export default Forgotpassword;
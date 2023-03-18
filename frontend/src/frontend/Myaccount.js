import React,{useState,useEffect} from "react";
import Footer from "./Components/Footer"
import Navbar from "./Components/Navbar";
import Topbar from "./Components/Topbar";
import axios from "axios";
import { useNavigate,useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Myaccount(){
  const params = useParams();
  const navigate = useNavigate();

  const user_token = localStorage.getItem("user_token");
  if(!user_token){
    navigate('/');
  }
 
  const handleLogout = () => {
      localStorage.removeItem("user_token"); 
       navigate('/')
   }

    let formValues={
        user_name:"",
        mobile_number:"",
        address:"",
        country:"",
        state:"",
        city:"",
        pincode:"",
        email:"",
        profile_picture_link:"",
        error:{
            user_name:"",
            mobile_number:"",
            address:"",
            country:"",
            state:"",
            city:"",
            pincode:"",
            email:"",
            profile_picture_link:""
        }
      }
   const [formData,setFormdata]=useState(formValues); 
  

   const handleChange =(e)=>{
     let error= { ...formValues.error };
     if(e.target.value === ""){
       error[e.target.name]=`${e.target.placeholder} is required`;
     }else{
       error[e.target.name]=""; 
     }
     setFormdata({...formData, [e.target.name]:e.target.value, error});
   }
   
   const handleSubmit= async (e)=>{
     e.preventDefault();
   
     const errorkeys=Object.keys(formData).filter((key)=>{
       if(formData[key] === "" && key!='error'){
         return key;
       }
     });
 
     if(errorkeys.length>0){
       toast('pls fill all the fields');   
     }else if(formData.password!==formData.confirm_password){
      toast('Password and Confirm Password doesnt match');   
    }else{
      async function getData(rowId){
        const response = await axios.get(`http://localhost:3001/Catalog/user/getUser/${rowId}`);
        const response1 = response.data.user_details;
        setFormdata({...formData,
                id:response1._id,
                user_name:response1.user_name,
                mobile_number:response1.mobile_number,
                address:response1.address,
                country:response1.country,
                state:response1.state,
                city:response1.city,
                pincode:response1.pincode,
                email:response1.email,
                profile_picture_link:response1.profile_picture_link
        }); 
        }     
    
    
      try {
        const response=await axios.put(`http://localhost:3001/Catalog/user/updateUser/${formData.id}`,{
        user_details:{
          user_name:formData.user_name,
          mobile_number:formData.mobile_number,
          address:formData.address,
          country:formData.country,
          state:formData.state,
          city:formData.city,
          pincode:formData.pincode,
          email:formData.email,
          profile_picture_link:formData.profile_picture_link
        }
        });
        
      
      setFormdata(formValues);
      toast(response.data.msg);
      getData(formData.id);//call user data when loading the file   
       
     }catch(error){
        toast(error.response.data.msg);  
     }
     } 
   }

   useEffect(() => {
    if(localStorage.getItem("user_token")){
      //navigate("/Login");
    }else{
      //navigate("/")
    }
    try{
  async function getData(rowId){
      const response = await axios.get(`http://localhost:3001/Catalog/user/getUser/${rowId}`);
      const response1 = response.data.user_details;
      setFormdata({...formData,
              id:response1._id,
              user_name:response1.user_name,
              mobile_number:response1.mobile_number,
              address:response1.address,
              country:response1.country,
              state:response1.state,
              city:response1.city,
              pincode:response1.pincode,
              email:response1.email,
              profile_picture_link:response1.profile_picture_link
      }); 
      }     
      getData(params.id);//call user data when loading the file
  
    }catch(error){
  
    }
    try{
  
        async function checKTokenexists(rowId){
          const response = await axios.get(`http://localhost:3001/Catalog/user/checKTokenexists/${rowId}`);
          console.log(response.data);
         }     
         checKTokenexists(localStorage.getItem("user_token"));//call user data when loading the file
  
        }
        catch(err){
          localStorage.setItem("user_token","");
          navigate(`/`); 
        }
       
      },[]);
        
    return (
        <>
         <Topbar/>
         <Navbar/>
         <div className="container-fluid">
         <div><ToastContainer /></div>
        <div className="row px-xl-5">
            <div className="col-lg-12">
                <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">My Account details</span></h5>
                <div className="bg-light p-30 mb-5">
                    <form onSubmit={(e)=>handleSubmit(e)}>
                         
                        <div className="row">
                           <div className="col-md-6 form-group">
                           <label for="product_name">User name</label>
                            <input className="form-control" id="user_name" name="user_name" type="text" value={formData.user_name}  onChange={(e) => handleChange(e)}  placeholder="user name" required/>
                            <span style={{color:"red"}}> {formData.error.user_name}</span>
                            <p className="help-block text-danger"></p>
                           </div>
                           <div className="col-md-6 form-group">
                           <label for="product_name">Mobile number</label>
                            <input className="form-control" id="mobile_number" name="mobile_number" type="text" value={formData.mobile_number}  onChange={(e) => handleChange(e)}  placeholder="mobile number" required/>
                            <span style={{color:"red"}}> {formData.error.mobile_number}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div className="col-md-6 form-group">
                            <label for="product_name">Address</label>
                            <textarea className="form-control" id="address" name="address" type="text" value={formData.address}  onChange={(e) => handleChange(e)}  placeholder="address" required></textarea>
                            <span style={{color:"red"}}> {formData.error.address}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div className="col-md-6 form-group">
                            <label for="product_name">Country</label>
                            <input className="form-control" id="country" name="country" type="text" value={formData.country}  onChange={(e) => handleChange(e)}  placeholder="country" required/>
                            <span style={{color:"red"}}> {formData.error.country}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div className="col-md-6 form-group">
                            <label for="product_name">State</label>
                            <input className="form-control" id="state" name="state" type="text" value={formData.state}  onChange={(e) => handleChange(e)}  placeholder="state" required/>
                            <span style={{color:"red"}}> {formData.error.state}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div className="col-md-6 form-group">
                           <label for="product_name">City</label>
                            <input className="form-control" id="city" name="city" type="text" value={formData.city}  onChange={(e) => handleChange(e)}  placeholder="city" required/>
                            <span style={{color:"red"}}> {formData.error.city}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div className="col-md-6 form-group">
                            <label for="product_name">Pin code</label>
                            <input className="form-control" id="pincode" name="pincode" type="text" value={formData.pincode}  onChange={(e) => handleChange(e)}  placeholder="pincode" required/>
                            <span style={{color:"red"}}> {formData.error.pincode}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                           <div className="col-md-6 form-group">
                            <label for="product_name">Email</label>
                            <input readOnly className="form-control" id="email" name="email" type="email" value={formData.email}  onChange={(e) => handleChange(e)}  placeholder="email" required/>
                            <span style={{color:"red"}}> {formData.error.email}</span>
                            <p className="help-block text-danger"></p>
                            </div>
                            <div className="col-md-6 form-group">
                            <label for="profile_picture_link">Profile picture link</label>
                            <input className="form-control" id="profile_picture_link" name="profile_picture_link" type="text" value={formData.profile_picture_link}  onChange={(e) => handleChange(e)}  placeholder="profile picture link" required/>
                            <span style={{color:"red"}}> {formData.error.profile_picture_link}</span>
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

export default Myaccount;
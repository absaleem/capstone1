import React,{useState} from "react";

import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Topbar from './Components/Topbar';

import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Contact(){  
   let formValues={
    user_name: "",
    email_id: "",
    subject: "",
    message: "",
    error:{
      user_name: "",
      email_id: "",
      subject: "",
      message: "",
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
        return false;
    });

    if(errorkeys.length>0){
      toast('pls fill all the fields');
    }else{
      try {
       const response=await axios.post("https://item-catalog-webservice.onrender.com/Catalog/admin/enquiry/createEnquiry",{"enquiry_details":{
        user_name: formData.user_name,
        email_id: FormData.email_id,
        subject: formData.subject,
        message: formData.message,
      }
      });
     
      setFormdata(formValues);
      toast(response.data.msg);    
         
    }catch(error){
  
    }
    } 
  }

   return( 
    <>
    <Topbar/>
    <Navbar/>
    <div class="container-fluid">
        <div class="row px-xl-5">
            <div class="col-12">
                <nav class="breadcrumb bg-light mb-30">
                    <a class="breadcrumb-item text-dark" href={"/"}>Home</a>
                    <span class="breadcrumb-item active">Contact</span>
                </nav>
            </div>
        </div>
    </div>

    <div class="container-fluid">
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Contact Us</span></h2>
        <div class="row px-xl-5">
            <div class="col-lg-7 mb-5">
                <div class="contact-form bg-light p-30">
                <div><ToastContainer /></div>
                <form name="sentMessage" id="contactForm" novalidate="novalidate" onSubmit={(e)=>handleSubmit(e)}>
                        <div class="control-group">
                        <label for="category_name">User name</label>
                        <input className="form-control" id="user_name" name="user_name" type="text" value={formData.user_name}  onChange={(e) => handleChange(e)}  placeholder="user name" required data-validation-required-message="Please enter your user name"/>
                            <p class="help-block text-danger"></p>
                        </div>
                        <div class="control-group">
                        <label for="category_name">Email</label>
                            <input type="email" class="form-control" id="email_id" name="email_id" placeholder="Your Email"  value={formData.email_id}  onChange={(e) => handleChange(e)}   required="required" data-validation-required-message="Please enter your email" />
                            <p class="help-block text-danger"></p>
                        </div>
                        <div class="control-group">
                        <label for="category_name">Subject</label>
                            <input type="text" class="form-control" id="subject" name="subject" placeholder="Subject" value={formData.subject}  onChange={(e) => handleChange(e)}  required="required" data-validation-required-message="Please enter a subject" />
                            <p class="help-block text-danger"></p>
                        </div>
                        <div class="control-group">
                        <label for="category_name">Message</label>
                            <textarea class="form-control" rows="8" id="message" name="message" placeholder="Message" value={formData.message}  onChange={(e) => handleChange(e)}  required="required"  data-validation-required-message="Please enter your message"></textarea>
                            <p class="help-block text-danger"></p>
                        </div>
                        <div>
                            <button class="btn btn-primary py-2 px-4" type="submit">Send Message</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="col-lg-5 mb-5">
                <div class="bg-light p-30 mb-30">
                    <iframe title="iframe-address" style={{width:"100%",height:"250px",border:"0"}}  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                    frameborder="0" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
                </div>
                <div class="bg-light p-30 mb-3">
                    <p class="mb-2"><i class="fa fa-map-marker-alt text-primary mr-3"></i>Redmond, New York, USA</p>
                    <p class="mb-2"><i class="fa fa-envelope text-primary mr-3"></i>info@itemcatalogue.com</p>
                    <p class="mb-2"><i class="fa fa-phone-alt text-primary mr-3"></i>+012 345 67890</p>
                </div>
            </div>
        </div>
    </div>

    <Footer/>
    </> 
    
    );
}

export default Contact;
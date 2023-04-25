import React,{useState,useEffect} from "react";
import Footeradmin from "../frontend/Components/Footeradmin";
import Navbaradmin from "../frontend/Components/Navbaradmin";
import axios from "axios";
import { useNavigate,useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Brandedit(){
    const navigate = useNavigate();
    const params = useParams();
    const admin_token = localStorage.getItem("admin_token");
   
    if(!admin_token){
        navigate('/admin');
    }

   let formValues={
    id:"",
    brand_name: "",
    brand_image: "",
    error:{
      brand_name: "",
      brand_image: "",
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
      alert('pls fill all the fields');
    }else{
      try {
        const response=await axios.put(`https://item-catalog-webservice.onrender.com/Catalog/updateBrand/${formData.id}`,{
        brand_details:{
            brand_name:formData.brand_name,
            brand_image:formData.brand_image,
        }
        });
      
      setFormdata(formValues);
      toast(response.data.msg);   
      setTimeout(() => {
      navigate('/admin/Brand');
      }, 2000); 
          
    }catch(error){
  
    }
    } 
  }

  useEffect(() => {
    try{
  async function getData(rowId){
      const response = await axios.get(`https://item-catalog-webservice.onrender.com/Catalog/getBrand/${rowId}`);
      const response1 = response.data.brand_details;
      setFormdata({...formData,
              id:response1._id,
              brand_name:response1.brand_name,
              brand_image:response1.brand_image,
      }); 
      }     
      getData(params.id);//call user data when loading the file
  
    }catch(error){
  
    }
    
  },[]);
       
        
    return (
        <>
        <Navbaradmin/>
        <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Create brand</span></h2>
        <div className="row px-xl-5">
            <div className="col-lg-7 mb-5">
                <div className="contact-form bg-light p-30">
                    <div><ToastContainer /></div>
                                               
                    <form  onSubmit={(e)=>handleSubmit(e)}>
                        <div className="control-group">
                        <label for="product_name">Brand name:</label>
                            <input className="form-control" id="brand_name" name="brand_name" type="text" value={formData.brand_name}  onChange={(e) => handleChange(e)}  placeholder="brand name" required/>
                            <span style={{color:"red"}}> {formData.error.brand_name}</span>
                            <p className="help-block text-danger"></p>
                        </div>
                        <div className="control-group">
                        <label for="product_name">Brand image url:</label>
                        <input className="form-control" id="brand_image" name="brand_image" type="text" value={formData.brand_image}  onChange={(e) => handleChange(e)}  placeholder="brand image" required/>
                            <span style={{color:"red"}}> {formData.error.brand_image}</span>
                            <p className="help-block text-danger"></p>
                        </div>
                        <div>
                        <button className="btn btn-primary btn-lg" type="submit">Save</button>           
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

export default Brandedit;
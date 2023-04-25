import React,{useState,useEffect} from "react";
import Footeradmin from "../frontend/Components/Footeradmin";
import Navbaradmin from "../frontend/Components/Navbaradmin";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Settings(){
   const navigate = useNavigate();
   const admin_token = localStorage.getItem("admin_token");
  
   if(!admin_token){
       navigate('/admin');
   }
   let formValues={
    home_slider1: "",
    home_slider2: "",
    home_slider3: "",
    home_slider4: "",
    error:{
        home_slider1: "",
        home_slider2: "",
        home_slider3: "",
        home_slider4: "",
     }
  }
  const handleChange =(e)=>{ 
    let error= { ...formValues.error };
    if(e.target.value === ""){
      error[e.target.name]=`${e.target.placeholder} is required`;
    }else{
      error[e.target.name]=""; 
    }
    const { value, checked } = e.target;
   
     // Case 1 : The user checks the box
    // alert(`${value} is ${checked}`);
     
     // Case 1 : The user checks the box
     if (checked) {
       setUserInfo( [...userinfo, value] );
     }   
     // Case 2  : The user unchecks the box
     else {
       setUserInfo(userinfo.filter((e) => e !== value));
     }

    setFormdata({...formData, [e.target.name]:e.target.value, error});
  }
  const [formData,setFormdata]=useState(formValues); 
  const [productlist,setProductdata]=useState([]);
  const [userinfo, setUserInfo] = useState([]);

  async function getSettings(rowId){
    const response = await axios.get(`https://item-catalog-webservice.onrender.com/Catalog/getSettings/${rowId}`);  
    const response1 = response.data.settings_details;
    setUserInfo(response1.home_featured_products);
    setFormdata({...formData,
            home_slider1: response1.home_slider1,
            home_slider2: response1.home_slider2,
            home_slider3: response1.home_slider3,
            home_slider4: response1.home_slider4,
           // home_featured_products: response1.home_featured_products,
    }); 
    }   

  const handleSubmit= async (e)=>{
    e.preventDefault();
  
    const { value, checked } = e.target;
    
     // Case 1 : The user checks the box
     //alert(`${value} is ${checked}`);
     
     // Case 1 : The user checks the box
     if (checked) {
       setUserInfo(
         [...userinfo, value],
       );
     }
   
     // Case 2  : The user unchecks the box
     else {
       setUserInfo(userinfo.filter((e) => e !== value));
     }

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
       const response=await axios.put(`https://item-catalog-webservice.onrender.com/Catalog/updateSettings/6396f5b18d3ca2485a0f0411`,{"settings_details":{
        home_slider1: formData.home_slider1,
        home_slider2: formData.home_slider2,
        home_slider3: formData.home_slider3,
        home_slider4: formData.home_slider4,
        home_featured_products: userinfo,
      }
      });
     
      setFormdata(formValues);
      toast(response.data.msg); 
      getSettings('6396f5b18d3ca2485a0f0411');//call user data when loading the file 
    
    }catch(error){
  
    }
    } 
  }

   useEffect(() => {

   async function getData(rowId){
      const response = await axios.get(`https://item-catalog-webservice.onrender.com/Catalog/getSettings/${rowId}`);  
      const response1 = response.data.settings_details;
      setUserInfo(response1.home_featured_products);
      
      setFormdata({...formData,
              home_slider1: response1.home_slider1,
              home_slider2: response1.home_slider2,
              home_slider3: response1.home_slider3,
              home_slider4: response1.home_slider4,
      }); 
      }    
      async function getProductlist(){
          try {  
          const response=await axios.get("https://item-catalog-webservice.onrender.com/Catalog/listProduct");
          setProductdata(response.data);  
          }catch(error){
          }
      }
      getData('6396f5b18d3ca2485a0f0411');//call user data when loading the file 
      getProductlist(); 
    },[]);
    return (
        <>
        <Navbaradmin/>
        <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Settings</span></h2>
        <div className="row px-xl-5">
            <div className="col-lg-12 mb-5">
                <div className="contact-form bg-light p-30">
                    <div><ToastContainer /></div>
                                               
                    <form  onSubmit={(e)=>handleSubmit(e)}>
                        <div className="control-group">
                        <label for="category_name">Home page slider Image url</label>
                        <input className="form-control" id="home_slider1" name="home_slider1" type="text" value={formData.home_slider1}  onChange={(e) => handleChange(e)}  placeholder="slider image url" required/>
                        <span style={{color:"red"}}> {formData.error.home_slider1}</span>
                        <input className="form-control" id="home_slider2" name="home_slider2" type="text" value={formData.home_slider2}  onChange={(e) => handleChange(e)}  placeholder="slider image url" required/>
                        <span style={{color:"red"}}> {formData.error.home_slider2}</span>
                        <input className="form-control" id="home_slider3" name="home_slider3" type="text" value={formData.home_slider3}  onChange={(e) => handleChange(e)}  placeholder="slider image url" required/>
                        <span style={{color:"red"}}> {formData.error.home_slider3}</span>
                        <input className="form-control" id="home_slider4" name="home_slider4" type="text" value={formData.home_slider4}  onChange={(e) => handleChange(e)}  placeholder="slider image url" required/>
                        <span style={{color:"red"}}> {formData.error.home_slider4}</span>
                       <p className="help-block text-danger"></p>
                       </div>
                       <div className="control-group">
                       <label for="sub_category_name">Featured Products</label><br/>
                        
                       { 
                        productlist ? (
                            productlist.map((prd) => (  
                              
                            <b><input checked={userinfo?.includes(prd._id)?true:false} onChange={(e) => handleChange(e)}  type='checkbox' id="product_list" name="product_list" 
                           value={prd._id}/>&nbsp;&nbsp;{prd.product_name }&nbsp;&nbsp;</b>
                        )))
                        :""}   
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

export default Settings;
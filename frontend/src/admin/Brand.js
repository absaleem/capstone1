import React,{useState,useEffect} from "react";
import Footeradmin from "../frontend/Components/Footeradmin";
import Navbaradmin from "../frontend/Components/Navbaradmin";
import Brandedit from "./Brandedit";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Brand(){
  const navigate = useNavigate();
  const admin_token = localStorage.getItem("admin_token");
 
  if(!admin_token){
      navigate('/admin');
  }

   let formValues={
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
  const [userdata,setUserdata]=useState([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit= async (e)=>{
    e.preventDefault();
  
    const errorkeys=Object.keys(formData).filter((key)=>{
      if(formData[key] === "" && key!='error'){
        return key;
      }
    });

    if(errorkeys.length>0){
      toast('pls fill all the fields');       
    }else{
      setLoading(true);
      try {
       const response=await axios.post("http://localhost:3001/Catalog/createBrand",{"brand_details":{
        brand_name:formData.brand_name,
        brand_image:formData.brand_image,
      }
      });
     
      setFormdata(formValues);
      toast(response.data.msg);    
      
      listDatas();
    
    }catch(error){
  
    }
    setLoading(false);
    } 
  }

   useEffect(() => {

        async function getData(){
          setLoading(true);
            try {  
            const response=await axios.get("http://localhost:3001/Catalog/listBrand");
            setUserdata(response.data);  
            }catch(error){
            }
         setLoading(false);
        }
        
        getData();//call user data when loading the file
        },[]);
        
      const listDatas= async function getData(){
        setLoading(true);
          try {  
          const response=await axios.get("http://localhost:3001/Catalog/listBrand");
          setUserdata(response.data); 
         
          }catch(error){
          }
          setLoading(false);
      }
     
      const handleProceed = (id,status) => {
        if(status==1){  navigate(`/admin/Brandedit/${id}`); }else{  }
      };
    
      async function onDeleteData(id){
        setLoading(true);
        try {
        const response = await axios.delete(`http://localhost:3001/Catalog/deleteBrand/${id}`);
        toast(response.data.msg);    
        listDatas();
        }catch(error){
    
        }
        setLoading(false);
      }  
     
        
    return (
        <>
        <Navbaradmin/>
        <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Create Brand</span></h2>
        <div className="row px-xl-5">
            <div className="col-lg-12 mb-5">
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
    <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">List Brand</span></h2>
        <div className="row px-xl-5">
        {loading && <div className='loading'>Loading</div>}
    {!loading && (
         
  <table className="table table-bordered bg-light" id="dataTable" style={{width:"100%",cellSpacing:"0"}}>  
   <thead>
     <tr>
       <th>Name</th>
       <th>Image</th>
       <th>Action</th>
       </tr>
       </thead> 
       <tbody>   
       {userdata ? (
         userdata.map((row) => (   
       <tr key={row._id}>
       <td>{row.brand_name}</td>
       <td><img src={row.brand_image} style={{ width:'100px',height:'100px'}}/></td>
       <td>
          <button className="btn btn-primary btn-sm" style={{margin:"2px"}}  onClick={(e)=>handleProceed(row._id,1)}><i className="fas fa-edit"></i></button>&nbsp;<br/>
          <button className="btn btn-primary btn-sm" style={{margin:"2px"}} onClick={()=>onDeleteData(row._id)}><i className="fas fa-trash"></i></button>
       </td>
       </tr>
     )))
     :" Loading..." }
     </tbody>
    </table>
    )}
        </div>
     </div>   
       <Footeradmin/>
   
    </>
    );
}

export default Brand;
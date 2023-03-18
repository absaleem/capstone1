import React,{useState,useEffect} from "react";
import Footeradmin from "../frontend/Components/Footeradmin";
import Navbaradmin from "../frontend/Components/Navbaradmin";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Dashboard(){
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

  const [formData,setFormdata]=useState(formValues); 
  const [userdata,setUserdata]=useState([]);
 

   useEffect(() => {

        async function getData(){
            try {  
            const response=await axios.get("http://localhost:3001/Catalog/listBrand");
            setUserdata(response.data);  
            }catch(error){
            }
        }
        
        getData();//call user data when loading the file
        },[]);
        
      const listDatas= async function getData(){
          try {  
          const response=await axios.get("http://localhost:3001/Catalog/listBrand");
          setUserdata(response.data); 
         
          }catch(error){
          }
      }
     
      const handleProceed = (id,status) => {
        if(status==1){  navigate(`/admin/Brandedit/${id}`); }else{  }
      };
    
      async function onDeleteData(id){
        try {
        const response = await axios.delete(`http://localhost:3001/Catalog/deleteBrand/${id}`);
        toast(response.data.msg);    
        listDatas();
        }catch(error){
    
        }
      }  
     
        
    return (
        <>
        <Navbaradmin/>
       
    <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">List Brand</span></h2>
        <div className="row px-xl-5">
       
         
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
        </div>
     </div>   
       <Footeradmin/>
   
    </>
    );
}

export default Dashboard;
import React,{useState,useEffect} from "react";
import Footeradmin from "../frontend/Components/Footeradmin";
import Navbaradmin from "../frontend/Components/Navbaradmin";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Enquiries(){
   
  const navigate = useNavigate();
  const admin_token = localStorage.getItem("admin_token");
 
  if(!admin_token){
      navigate('/admin');
  }
  const [userdata,setUserdata]=useState([]);

   useEffect(() => {

        async function getData(){
            try {  
            const response=await axios.get("http://localhost:3001/Catalog/user/listUsers");
            console.log(response);
            setUserdata(response.data);  
            }catch(error){
            }
        }     
        getData();//call user data when loading the file
        },[]);
        
     return (
        <>
        <Navbaradmin/>
    <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Users</span></h2>
        <div className="row px-xl-5">
         
  <table className="table table-bordered bg-light" id="dataTable" style={{width:"100%",cellSpacing:"0"}}>  
   <thead>
     <tr>
       <th>User name</th>
       <th>Mobile no</th>
       <th>Email</th>
       <th>Address</th>
       <th>Country</th>
       <th>State</th>
       <th>City</th>
       <th>Pincode</th>
       </tr>
       </thead> 
       <tbody>   
       {userdata ? (
         userdata.map((row) => (   
       <tr key={row._id}>
       <td>{row.user_name}</td>
       <td>{row.mobile_number}</td>
       <td>{row.email}</td>
       <td>{row.address}</td>
       <td>{row.country}</td>
       <td>{row.state}</td>
       <td>{row.city}</td>
       <td>{row.pincode}</td>
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

export default Enquiries;
import React,{useState,useEffect} from "react";
import Footeradmin from "../frontend/Components/Footeradmin";
import Navbaradmin from "../frontend/Components/Navbaradmin";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Subcategory(){
  const navigate = useNavigate();
  const admin_token = localStorage.getItem("admin_token");
 
  if(!admin_token){
      navigate('/admin');
  }

   let formValues={
    category_id: "",
    sub_category_name: "",
    error:{
        category_id: "",
        sub_category_name: "",
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
  const [categoryList, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getCategory(){
    const listCategorydata= await axios.get("http://localhost:3001/Catalog/listCategory");
    let category_data= listCategorydata.data.sort(function(a, b){
      if(a.category_name < b.category_name) { return -1; }
      if(a.category_name > b.category_name) { return 1; }
      return 0;
  })
    setCategoryOptions(category_data);
    }

  const handleSubmit= async (e)=>{
    e.preventDefault();
  
    const errorkeys=Object.keys(formData).filter((key)=>{
      if(formData[key] === "" && key!='error'){
        return key;
      }
    });

    if(errorkeys.length>0){
      alert('pls fill all the fields');
    }else{
      setLoading(true);
      try {
       const response=await axios.post("http://localhost:3001/Catalog/createSubcategory",{"sub_category_details":{
        category_id: formData.category_id,
        sub_category_name: formData.sub_category_name,
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
            const response=await axios.get("http://localhost:3001/Catalog/listSubcategory");
            setUserdata(response.data);  
            }catch(error){
            }
         setLoading(false);
        }
        
        getData();//call user data when loading the file
        getCategory();
        },[]);
        
      const listDatas= async function getData(){
        setLoading(true);
          try {  
          const response=await axios.get("http://localhost:3001/Catalog/listSubcategory");
          setUserdata(response.data); 
         
          }catch(error){
          }
          setLoading(false);
      }
     
      const handleProceed = (id,status) => {
        if(status==1){  navigate(`/admin/Subcategoryedit/${id}`); }else{  }
      };
    
      async function onDeleteData(id){
        setLoading(true);
        try {
        const response = await axios.delete(`http://localhost:3001/Catalog/deleteSubcategory/${id}`);
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
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Create sub category</span></h2>
        <div className="row px-xl-5">
            <div className="col-lg-12 mb-5">
                <div className="contact-form bg-light p-30">
                    <div><ToastContainer /></div>
                                               
                    <form  onSubmit={(e)=>handleSubmit(e)}>
                        <div className="control-group">
                        <label for="category_name">Category name</label>
                        <select className="form-control"  name="category_id" id="category_id" value={formData.category_id}  onChange={(e) => handleChange(e)} >
                        <option value='0'>Select Category</option>  
                        { categoryList.length > 0 && categoryList.map((item) => (
                        <option value={item._id}>{item.category_name}</option>  
                        ))
                        }  
                       </select> 
                       <span style={{color:"red"}}> {formData.error.category_id}</span>
                       <p className="help-block text-danger"></p>
                       </div>
                       <div className="control-group">
                       <label for="sub_category_name">Sub category name</label>
                            <input className="form-control" id="sub_category_name" name="sub_category_name" type="text" value={formData.sub_category_name}  onChange={(e) => handleChange(e)}  placeholder="sub category name" required/>
                            <span style={{color:"red"}}> {formData.error.sub_category_name}</span>
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
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">List sub category</span></h2>
        <div className="row px-xl-5">
        {loading && <div className='loading'>Loading</div>}
    {!loading && (
         
  <table className="table table-bordered bg-light" id="dataTable" style={{width:"100%",cellSpacing:"0"}}>  
   <thead>
     <tr>
       <th>Category Name</th>
       <th>Name</th>
       <th>Action</th>
       </tr>
       </thead> 
       <tbody>   
       {userdata ? (
         userdata.map((row) => (   
       <tr key={row._id}>
       <td>{row.category.category_name}</td>
       <td>{row.sub_category_name}</td>
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

export default Subcategory;
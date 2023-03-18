import React,{useState,useEffect} from "react";
import Footeradmin from "../frontend/Components/Footeradmin";
import Navbaradmin from "../frontend/Components/Navbaradmin";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Productprice(){
  const navigate = useNavigate();
  const admin_token = localStorage.getItem("admin_token");
 
  if(!admin_token){
      navigate('/admin');
  }

   let formValues={
    product_id: "",
    product_image: "",
    product_price: "",
    product_discount_price: "",
   error:{
      product_id: "",
      product_image: "",
      product_price: "",
      product_discount_price: "",
         }
  }

  const [formData,setFormdata]=useState(formValues); 
  const [userdata,setUserdata]=useState([]);
  const [productList,setProductdata]=useState([]);
  const [loading, setLoading] = useState(true);
  const [radioList,setRadiodata]=useState([]);
  const [subcategoryList, setSubcategoryOptions] = useState([]);
  
  const handleChange =(e)=>{
    let error= { ...formValues.error };
    if(e.target.value === ""){
      error[e.target.name]=`${e.target.placeholder} is required`;
    }else{
      error[e.target.name]=""; 
    }
    setFormdata({...formData, [e.target.name]:e.target.value, error});
  }
   const handleChangeradio=(e,cat_id,cat_name,sub_cat_id,sub_cat_name)=>{
   const { value, checked } = e.target;
   console.log(value);
   let array = [...radioList];
   //console.log('cat_id==',cat_id);
   let isAvailable = array.find(el=>el.cat_id === cat_id);
    
   if(isAvailable){
      array.map((ele, index)=>{
        if(ele.cat_id === cat_id){ 
          ele.sub_cat_id = value
        }else if(ele.cat_id !== cat_id){
          return ele;
        }        
       });  
    }else{
    array.push(sub_cat_id);
    }

   setRadiodata(array);
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
    }else{
      setLoading(true);
      try {

       const response=await axios.post("http://localhost:3001/Catalog/createProductprice",{"product_details":{
        product_id: formData.product_id,
        product_image: formData.product_image,
        product_price: formData.product_price,
        product_discount_price: formData.product_discount_price,
        sub_cat_id:radioList,
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
            const response=await axios.get("http://localhost:3001/Catalog/listProductprice");
            setUserdata(response.data);  
            }catch(error){
            }
         setLoading(false);
        }
        async function getProductlist(){
            setLoading(true);
              try {  
              const response=await axios.get("http://localhost:3001/Catalog/listProduct");
              setProductdata(response.data);  
              }catch(error){
              }
           setLoading(false);
          }

      async function getSubcategory(){
          setLoading(true); var arr=Array(); var cat_id=''; //var arr1=Array();
            try {  
            const response_list=await axios.get("http://localhost:3001/Catalog/getSubcategorybycategory");
            var count_cat=0;
            for(var i=0;i<response_list.data.length;i++){
                
                if(response_list.data[i].category_id!=cat_id){
                  var arr1=Array();
                  arr1.push({'sub_category_id':response_list.data[i]._id,'sub_category_name':response_list.data[i].sub_category_name,'category_id':response_list.data[i].category_id });
                  count_cat=count_cat+1;
                }else{
                  arr1.push({'sub_category_id':response_list.data[i]._id,'sub_category_name':response_list.data[i].sub_category_name,'category_id':response_list.data[i].category_id });
                }
                arr[count_cat]=[{'category_id':response_list.data[i].category_id,'category_name':response_list.data[i].category.category_name,sub_category_details:arr1}]
                
                var cat_id=response_list.data[i].category_id;
              }
            
            }catch(error){
            }
            setSubcategoryOptions(arr);    
            setLoading(false);
         }
            async function getProductlist(){
            setLoading(true);
              try {  
              const response=await axios.get("http://localhost:3001/Catalog/listProduct");
              setProductdata(response.data);  
              }catch(error){
              }
           setLoading(false);
          }

           
        getProductlist(); getSubcategory(); getData();//call user data when loading the file
        },[]);
        
      const listDatas= async function getData(){
        setLoading(true);
          try {  
          const response=await axios.get("http://localhost:3001/Catalog/listProductprice");
          setUserdata(response.data); 
         
          }catch(error){
          }
          setLoading(false);
      }
     
      const handleProceed = (id,status) => {
        if(status==1){  navigate(`/admin/Productpriceedit/${id}`); }else{  }
      };
    
      async function onDeleteData(id){
        setLoading(true);
        try {
        const response = await axios.delete(`http://localhost:3001/Catalog/deleteProduct/${id}`);
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
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Create product price</span></h2>
        <div className="row px-xl-5">
            <div className="col-lg-12 mb-5">
                <div className="contact-form bg-light p-30">
                    <div><ToastContainer /></div>
                                               
                    <form onSubmit={(e)=>handleSubmit(e)}>
                       <div className="control-group">
                        <label for="category_name">Product name</label>
                        <select className="form-control"  name="product_id" id="product_id" value={formData.product_id}  onChange={(e) => handleChange(e)} >
                        <option value=''>Select Product</option>  
                        { productList.length > 0 && productList.map((product_item) => (
                        <option key={product_item._id} value={product_item._id}>{product_item.product_name}</option>  
                        ))
                        }  
                       </select> 
                       <span style={{color:"red"}}> {formData.error.product_id}</span>
                       <p className="help-block text-danger"></p>
                       </div>         
                    <div className="control-group">
                        <label for="category_name">Product Specifications</label><br/>
                      { 
                      subcategoryList.length > 0 && subcategoryList.map((subcategoryList_item) => ( 
                       
                        <div className="col-sm-12" key={subcategoryList_item[0].category_id}><b>{subcategoryList_item[0].category_name}</b><br/>
                          { 
                          subcategoryList_item[0].sub_category_details.length > 0 && subcategoryList_item[0].sub_category_details.map((su_item) => ( 
                          <label key={su_item.sub_category_id} style={{padding:'2px'}}><input onChange={(e) => handleChangeradio(e,subcategoryList_item[0].category_id,subcategoryList_item[0].category_name,su_item.sub_category_id,su_item.sub_category_name)}  type="radio" id="sub_category_id" name={`${subcategoryList_item[0].category_id}`} value={su_item.sub_category_id} required/> &nbsp;{su_item.sub_category_name}&nbsp;</label>
                            ))
                           } 
                         </div>

                        ))
                        } 
                       <span style={{color:"red"}}> {formData.error.product_specification}</span>
                       <p className="help-block text-danger"></p>
                       </div>   
                       <div className="control-group">
                       <label for="product_name">Product price</label>
                            <input className="form-control" id="product_price" name="product_price" type="text" value={formData.product_price}  onChange={(e) => handleChange(e)}  placeholder="product price" required/>
                            <span style={{color:"red"}}> {formData.error.product_price}</span>
                            <p className="help-block text-danger"></p>
                        </div>
                        <div className="control-group">
                       <label for="product_name">Product discount price</label>
                            <input className="form-control" id="product_discount_price" name="product_discount_price" type="text" value={formData.product_discount_price}  onChange={(e) => handleChange(e)}  placeholder="product discount price" required/>
                            <span style={{color:"red"}}> {formData.error.product_discount_price}</span>
                            <p className="help-block text-danger"></p>
                        </div>
                        <div className="control-group">
                        <label for="product_name">Product image</label>
                        <input className="form-control" id="product_image" name="product_image" type="text" value={formData.product_image}  onChange={(e) => handleChange(e)}  placeholder="product image" required/>
                            <span style={{color:"red"}}> {formData.error.product_image}</span>
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
        <h2 classNam3e="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">List Product price</span></h2>
        <div className="row px-xl-5">
        {loading && <div className='loading'>Loading</div>}
    {!loading && (
         
  <table className="table table-bordered bg-light" id="dataTable" style={{width:"100%",cellSpacing:"0"}}>  
   <thead>
     <tr>
       <th>Name</th>
       <th>Image</th>
       <th>Actual Price</th>
       <th>Discount Price</th>
       <th>Action</th>
       </tr>
       </thead> 
       <tbody>   
       {userdata ? (
         userdata.map((row) => (   
       <tr key={row._id}>
       <td>{row.product_name}</td>
       <td><img src={row.product_image} style={{ width:'100px',height:'100px'}}/></td>
       <td> &#8377;{row.product_price}</td>
       <td> &#8377;{row.product_discount_price}</td>
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

export default Productprice;
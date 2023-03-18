import React,{useState,useEffect} from "react";
import Footeradmin from "../frontend/Components/Footeradmin";
import Navbaradmin from "../frontend/Components/Navbaradmin";
import axios from "axios";
import { useNavigate,useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DefaultEditor } from 'react-simple-wysiwyg';


function Productedit(){
  const params = useParams();
  const navigate = useNavigate();
  const admin_token = localStorage.getItem("admin_token");
 
  if(!admin_token){
      navigate('/admin');
  }

   let formValues={
    brand_id:"",
    product_name: "",
    error:{
      brand_id:"",
      product_name: "",
       }
  }

  const [formData,setFormdata]=useState(formValues); 
  const [userdata,setUserdata]=useState([]);
  const [brandList,setBranddata]=useState([]);
  const [loading, setLoading] = useState(true);
  const [html_editor, setHtml] = useState('');
  const [html_editor1, setHtml1] = useState('');

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
      setSubcatlist( [...sub_cat_list, value] );
    }   
    // Case 2  : The user unchecks the box
    else {
      setSubcatlist(sub_cat_list.filter((e) => e !== value));
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
    const { value, checked } = e.target;
   
    // Case 1 : The user checks the box
   // alert(`${value} is ${checked}`);
    
    // Case 1 : The user checks the box
    if (checked) {
      setSubcatlist( [...sub_cat_list, value] );
    }   
    // Case 2  : The user unchecks the box
    else {
      setSubcatlist(sub_cat_list.filter((e) => e !== value));
    }

    if(errorkeys.length>0){
      toast('pls fill all the fields');
    }else{
      setLoading(true);
      try {

        const response=await axios.put(`http://localhost:3001/Catalog/updateProduct/${formData.id}`,{
          product_details:{
            brand_id:formData.brand_id,
            product_name: formData.product_name,
            product_description: html_editor1, 
            product_specification: html_editor,
          }
          });
        
        setFormdata(formValues);
        toast(response.data.msg);   
        setTimeout(() => {
        navigate('/admin/Product');
        }, 2000);   
      
      listDatas();
    
    }catch(error){
  
    }
    setLoading(false);
    } 
  }
  function onChangeeditor(e) {
    setHtml(e.target.value);
  }
  function onChangeeditor1(e) {
    setHtml1(e.target.value);
  }
   useEffect(() => {

        async function getData(){
          setLoading(true);
            try {  
            const response=await axios.get("http://localhost:3001/Catalog/listProduct");
            setUserdata(response.data);  
            }catch(error){
            }
         setLoading(false);
        }

        async function getBrand(){
          setLoading(true);
            try {  
            const response=await axios.get("http://localhost:3001/Catalog/listBrand");
            setBranddata(response.data);  
            }catch(error){
            }
         setLoading(false);
        }

        async function getData(rowId){
          const response = await axios.get(`http://localhost:3001/Catalog/getProduct/${rowId}`);
          const response1 = response.data.product_details;
          if(response1.cat_subcat_list && response1.cat_subcat_list.length>0){
            setSubcatlist(response1.cat_subcat_list);
          }else{
            setSubcatlist([]);     
          }
          setHtml(response1.product_specification);
          setHtml1(response1.product_description);
          setFormdata({...formData,
                  id:response1._id,
                  brand_id: response1.brand_id,
                  product_name: response1.product_name,
                  product_image: response1.product_image,
                  product_price: response1.product_price,
                  product_discount_price: response1.product_discount_price,      
                  product_description: response1.product_description, 
                  product_specification: response1.product_specification,
          }); 
          }     
        getData(params.id);//call user data when loading the file           
        getBrand();//call user data when loading the file
        getSubcategory();
        },[]);
        
      const listDatas= async function getData(){
        setLoading(true);
          try {  
          const response=await axios.get("http://localhost:3001/Catalog/listProduct");
          setUserdata(response.data); 
         
          }catch(error){
          }
          setLoading(false);
      }
     
      const handleProceed = (id,status) => {
        if(status==1){  navigate(`/admin/Productedit/${id}`); }else{  }
      };
   //   console.log(radioList);
    console.log(sub_cat_list);
        
    return (
        <>
        <Navbaradmin/>
        <div className="container-fluid">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Update product</span></h2>
        <div className="row px-xl-5">
            <div className="col-lg-12 mb-5">
                <div className="contact-form bg-light p-30">
                    <div><ToastContainer /></div>
                                               
                    <form onSubmit={(e)=>handleSubmit(e)}>
                         
                        <div className="control-group">
                        <label for="category_name">Product Specifications</label><br/>
                        { 
                      subcategoryList.length > 0 && subcategoryList.map((subcategoryList_item) => ( 
                       
                        <div className="col-sm-12" key={subcategoryList_item[0].category_id}><b>{subcategoryList_item[0].category_name}</b><br/>
                          { 
                          subcategoryList_item[0].sub_category_details.length > 0 && subcategoryList_item[0].sub_category_details.map((su_item) => ( 
                          <label key={su_item.sub_category_id} style={{padding:'2px'}}><input checked={sub_cat_list?.includes(su_item.sub_category_id)?true:false} onChange={(e) => handleChange(e)}  type="radio" id="sub_category_id" name={`${subcategoryList_item[0].category_id}`} value={su_item.sub_category_id} required/> &nbsp;{su_item.sub_category_name}&nbsp;</label>
                            ))
                           } 
                         </div>

                        ))
                        } 
                       <span style={{color:"red"}}> {formData.error.product_specification}</span>
                       <p className="help-block text-danger"></p>
                       </div>         
                       <div className="control-group">
                        <label for="category_name">Brand name</label>
                        <select className="form-control"  name="brand_id" id="brand_id" value={formData.brand_id}  onChange={(e) => handleChange(e)} >
                        <option value=''>Select Brand</option>  
                        { brandList.length > 0 && brandList.map((brand_item) => (
                        <option value={brand_item._id}>{brand_item.brand_name}</option>  
                        ))
                        }  
                       </select> 
                       <span style={{color:"red"}}> {formData.error.brand_id}</span>
                       <p className="help-block text-danger"></p>
                       </div>         
                       <div className="control-group">
                       <label for="product_name">Product name</label>
                            <input className="form-control" id="product_name" name="product_name" type="text" value={formData.product_name}  onChange={(e) => handleChange(e)}  placeholder="product name" required/>
                            <span style={{color:"red"}}> {formData.error.product_name}</span>
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
                        <div className="control-group">
                        <label for="product_name">Product highlights</label>
                      <DefaultEditor value={html_editor1} onChange={onChangeeditor1} />
                            <p className="help-block text-danger"></p>
                        </div>
                        <div className="control-group">
                        <label for="product_name">Product overview</label>
                           <DefaultEditor value={html_editor} onChange={onChangeeditor} />
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

export default Productedit;
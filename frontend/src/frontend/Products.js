import React,{useState,useEffect} from "react";

import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Topbar from './Components/Topbar';

import axios from "axios";
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Products(){

  //const navigate = useNavigate();
  const params = useParams();
  
  const [productList,setProductdata]=useState([]);
  const [subcategoryList, setSubcategoryOptions] = useState([]);
  const [radioList,setRadiodata]=useState([]);
  //const [avg_review, setAveragereview]=useState();
  //const [product_review_count, setProductreviewcount]=useState();
  

    const handleChangeradio=(e,cat_id,sub_cat_id)=>{
        const { value, checked } = e.target;
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
        if(radioList.length<1){
          toast('Pls select Atleast a filter');
        }else{
          try {    
            const response=await axios.post("https://item-catalog-webservice.onrender.com/Catalog/searchbySubcategory",{"search_details":{
              sub_cat_id: radioList.toString(),
            }});
         setProductdata(response.data);  
        }catch(error){
      
        }
        setRadiodata([]);
        var radioButton = document.getElementById("sub_category_id");
             radioButton.checked = false;
        } 
        
      }
       
       useEffect(() => {
        async function getProductlist(){
            try {  
            const response=await axios.get("https://item-catalog-webservice.onrender.com/Catalog/listProduct");
            setProductdata(response.data);  
            }catch(error){
            }
        }
        async function getData(brand_id){
            try {  
            const response=await axios.get(`https://item-catalog-webservice.onrender.com/Catalog/getBrandproducts/${brand_id}`);
            const response1 = response.data;
            setProductdata(response1[0]);  
            //setAveragereview(response1[1][0].ratingAvg); 
            //setProductreviewcount(response1[1][0]); 
            }catch(error){
            }
        }   
        
        async function getSubcategory(){
          var arr=Array(); var cat_id=''; var arr1=[];
            try {  
            const response_list=await axios.get("https://item-catalog-webservice.onrender.com/Catalog/getSubcategorybycategory");
            var count_cat=0;
            for(var i=0;i<response_list.data.length;i++){
                
                if(response_list.data[i].category_id!==cat_id){
                  var arr1=Array();
                  arr1.push({'sub_category_id':response_list.data[i]._id,'sub_category_name':response_list.data[i].sub_category_name,'category_id':response_list.data[i].category_id });
                  count_cat=count_cat+1;
                }else{
                  arr1.push({'sub_category_id':response_list.data[i]._id,'sub_category_name':response_list.data[i].sub_category_name,'category_id':response_list.data[i].category_id });
                }
                arr[count_cat]=[{'category_id':response_list.data[i].category_id,'category_name':response_list.data[i].category.category_name,sub_category_details:arr1}]
                
                cat_id=response_list.data[i].category_id;
              }
            
            }catch(error){
            }
            setSubcategoryOptions(arr);    
         }
       
        if(params.id){
          getData(params.id);//call user data when loading the file
        }else{
          getProductlist();
        }
        getSubcategory();        
    },[]);
   

   return( 
    <>
    <Topbar/>
    <Navbar/>
    <div className="container-fluid">
        <div className="row px-xl-5">
            <div className="col-12">
                <nav className="breadcrumb bg-light mb-30">
                    <a className="breadcrumb-item text-dark" href={"/"}>Home</a>
                    <span className="breadcrumb-item active">Product</span>
                </nav>
            </div>
        </div>
    </div>

    <div className="container-fluid">
        <div className="row px-xl-5">
        <div><ToastContainer /></div>
            <div className="col-lg-3 col-md-4">
                     { 
                        subcategoryList.length > 0 && subcategoryList.map((subcategoryList_item) => ( 
                        <>
                        <h5 className="section-title position-relative text-uppercase mb-3" key={subcategoryList_item[0].category_id}><span className="bg-secondary pr-3">Filter by {subcategoryList_item[0].category_name}</span></h5>
                        <div className="bg-light p-4 mb-30">
                        <form>
                          {
                          subcategoryList_item[0].sub_category_details.length > 0 && subcategoryList_item[0].sub_category_details.map((su_item) => (
                            <div className="custom-control custom-radio custom-control-inline d-flex align-items-center justify-content-between" key={su_item.sub_category_id}>
                            <label key={su_item.sub_category_id} style={{padding:'1px'}}><input onChange={(e) => handleChangeradio(e,subcategoryList_item[0].category_id,su_item.sub_category_id)}  type="radio" id="sub_category_id" name={`${subcategoryList_item[0].category_id}`} value={su_item.sub_category_id} required/> &nbsp;{su_item.sub_category_name}&nbsp;</label>
                            </div>
                            ))
                           } 
                         </form>
                         </div>
                        </>  
                        ))
                        } 
                        <button className="btn btn-primary btn-lg" type="submit" onClick={handleSubmit}>Search</button>
                <br/>
            </div>
            <div className="col-lg-9 col-md-8">
                <div className="row pb-3">
                     {
                     (productList.length>0)?
                        productList.map((row) => (   
      
                    <div className="col-lg-4 col-md-6 col-sm-6 pb-1"  key={row._id}>
                        <div className="product-item bg-light mb-4">
                            <div className="product-img position-relative overflow-hidden">
                                <img className="img-fluid w-100" style={{height:"300px",width:"300px"}} src={row.product_image} alt={row.product_name}/>
                                <div className="product-action">
                                    <a href={ `/Productdetail/${row._id}`}  className="btn btn-outline-dark btn-square"><i className="fa fa-search"></i></a>
                                </div>
                            </div>
                            <div className="text-center py-4">
                                <a className="h6 text-decoration-none text-truncate" href={ `/Productdetail/${row._id}`}>{row.product_name}</a>
                                <div className="d-flex align-items-center justify-content-center mt-2">
                                    <h5>${row.product_discount_price}</h5><h6 className="text-muted ml-2"><del>${row.product_price}</del></h6>
                                </div>
                               {/*<div className="d-flex align-items-center justify-content-center mb-1">
                                             { avg_review && avg_review?"":"No Reviews Yet"}
                                             { avg_review>0 && avg_review?(<small className="fa fa-star text-primary mr-1"></small> ):""}
                                             { avg_review>1 && avg_review?(<small className="fa fa-star text-primary mr-1"></small> ):""}
                                             { avg_review>2 && avg_review?(<small className="fa fa-star text-primary mr-1"></small> ):""}
                                             { avg_review>3 && avg_review?(<small className="fa fa-star text-primary mr-1"></small> ):""}
                                             { avg_review>4 && avg_review?(<small className="fa fa-star text-primary mr-1"></small> ):""}
                                             &nbsp;<small>({avg_review})</small>
                                </div>*/}
                            </div>
                        </div>
                    </div>
                        )):<div className="col-12 justify-content-center"><h5>Item not found</h5></div>
                    }
                  
                  
                </div>
            </div>       
          </div>  
        </div>     
    <Footer/>
    </> 
    
    );
}

export default Products;
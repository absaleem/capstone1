import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


function Featuredproducts(){

const navigate = useNavigate();
const [featured_list,setFeaturedlist]=useState([]);
const handlesSubmit =(id)=>{
    navigate(`/Productdetail/${id}`);
}

useEffect(() => {

    async function getData(){
        let data = [];
       const response = await axios.get(`https://item-catalog-webservice.onrender.com/Catalog/listFeaturedsettings/`);  
       
       response.data.length > 0 &&  response.data.map((item) => {
          if(data.indexOf(item.product_id) < 0) {
             let obj = {
              product_id: item.product_id,
              product_name: item.product_name,
              product_image: item.product_image,
            };
            data.push(obj);
         }
       data.reduceRight((acc, obj, i) => {
          acc[obj.product_id]? data.splice(i, 1) : acc[obj.product_id] = true;
          return acc;
        }, Object.create(null));
        
        data.sort((a, b) => b.price - a.price);

            setFeaturedlist(data);   
            
          });
       } 
       getData();//call user data when loading the file     
    
     },[]);
    
    return( 
    <>
    <div className="container-fluid pt-5 pb-3">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Featured Products</span></h2>
        <div className="row px-xl-5">
        { 
                      
            featured_list.length > 0 && featured_list.map((product) => (    
                    
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={product.product_id}>
                <div className="product-item bg-light mb-4">
                    <div className="product-img position-relative overflow-hidden">
                    <img className="img-fluid w-100" src={product.product_image} />
                        <div className="product-action">
                            <a href={"/"} style={{cursor:"pointer"}} className="btn btn-outline-dark btn-square" onClick={()=>handlesSubmit(product.product_id)} ><i className="fa fa-search"></i></a>
                        </div>
                    </div>
                    <div className="text-center py-4">
                        <a href={"/"} style={{cursor:"pointer"}} className="h6 text-decoration-none text-truncate" onClick={()=>handlesSubmit(product.product_id)} >{product.product_name}</a>
                        <div className="d-flex align-items-center justify-content-center mt-2">
                        </div>
                    </div>
                </div>
            </div>
            // ))
            ))
                    }
        </div>
    </div>
    
    </> 
    );
}

export default Featuredproducts;
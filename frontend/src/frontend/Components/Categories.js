import React,{useState,useEffect} from "react";
import { Link,useNavigate,useParams } from 'react-router-dom';
import axios from "axios";

function Categories(){
    let url="";
    const navigate = useNavigate();

    const [categoryList, setCategoryOptions] = useState([]);
   
    useEffect(() => {

        async function getCategory(){
            const listCategorydata= await axios.get("https://item-catalog-webservice.onrender.com/Catalog/listCategory");
          setCategoryOptions(listCategorydata);
        }        
        getCategory();
        },[]);
        
   
    return( 
    <>
   <div className="container-fluid pt-5">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Categories</span></h2>
        <div className="row px-xl-5 pb-3">
        { categoryList.length > 0 && categoryList.map((item) => (
                       
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                <a className="text-decoration-none" href="">
                    <div className="cat-item d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style={{width:"100px",height:"100px"}}>
                        <Link to={ `/Products/${item._id}` }  className="text-body mr-3"><img className="img-fluid" src={item.category_image_url} alt=""/></Link>
                            
                        </div>
                        <div className="flex-fill pl-3">
                            <h6>{item.category_name}</h6>
                            <small className="text-body"></small>
                        </div>
                    </div>
                </a>
            </div>
            ))
        }  
        </div>
    </div>
    </> 
    );
}
export default Categories;
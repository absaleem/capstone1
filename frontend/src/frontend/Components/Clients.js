import React,{useState,useEffect} from "react";
import { Link,useNavigate,useParams } from 'react-router-dom';
import axios from "axios";

function Clients(){
    let url="";
    const [brandList, setBrandOptions] = useState([]);
   
    useEffect(() => {

        async function getBrand(){
            const listBranddata= await axios.get("http://localhost:3001/Catalog/listBrand");
            setBrandOptions(listBranddata.data);
        }        
        getBrand();
        },[]);
        
   
    return( 
    <>
   <div className="container-fluid pt-5">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Brands</span></h2>
        <div className="row px-xl-5 pb-3">
        { brandList.length > 0 && brandList.map((brand_item) => (
                       
            <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={brand_item._id}>
                <a className="text-decoration-none" href="">
                    <div className="cat-item d-flex align-items-center mb-4">
                        <div className="overflow-hidden" style={{width:"100px",height:"100px"}}>
                        <Link to={ `/Products/${brand_item._id}` }><img className="img-fluid" src={brand_item.brand_image} alt=""/></Link>
                       </div>
                        <div className="flex-fill pl-3">
                        <Link to={ `/Products/${brand_item._id}` }><h6>{brand_item.brand_name}</h6></Link>
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
export default Clients;
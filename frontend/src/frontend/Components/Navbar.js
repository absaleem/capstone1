import React,{useState,useEffect} from "react";
import { Link,useNavigate,useParams } from 'react-router-dom';
import axios from "axios";

function Navbar(){
    let url="";

    const [brandList, setBrandOptions] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
   
    useEffect(() => {

        async function getBrands(){
            const listBranddata= await axios.get("http://localhost:3001/Catalog/listBrand");
            let brand_data= listBranddata.data.sort(function(a, b){
              if(a.brand_name < b.brand_name) { return -1; }
              if(a.brand_name > b.brand_name) { return 1; }
              return 0;
          })
          setBrandOptions(brand_data);
        }        
        getBrands();
        },[]);
        
       const handlesSubmitmenu =(id)=>{
        navigate(`/Products/${id}`);
       }
   
        
    return( 
    <>
    <div className="container-fluid bg-dark mb-30">
        <div className="row px-xl-5">
            <div className="col-lg-3 d-none d-lg-block">
                <a className="btn d-flex align-items-center justify-content-between bg-primary w-100" href="#navbar-vertical" data-toggle="collapse" style={{height:"65px",padding:"0 30px"}}>
                    <h6 className="text-dark m-0"><i className="fa fa-bars mr-2"></i>Brands</h6>
                    <i className="fa fa-angle-down text-dark"></i>
                </a>
                <nav className="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light" id="navbar-vertical" style={{width:"calc(100% - 30px)",zIndex:"999"}}>
                    <div className="navbar-nav w-100">
                        { brandList.length > 0 && brandList.map((item) => (
                        <a key={item._id} href={ `/Products/${item._id}`} className="nav-item nav-link">{item.brand_name}</a>
                        ))
                        }  
                    </div>
                </nav>
            </div>
            <div className="col-lg-9">
                <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
                    <a href={url} className="text-decoration-none d-block d-lg-none">
                        <span className="h1 text-uppercase text-dark bg-light px-2">Item</span>
                        <span className="h1 text-uppercase text-light bg-primary px-2 ml-n1">Catalog</span>
                    </a>
                    <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                        <div className="navbar-nav mr-auto py-0">
                            <a href="/" className="nav-item nav-link active">Home</a>
                            { brandList.length > 0 && brandList.map((item1) => (
                        <a key={item1._id} href={ `/Products/${item1._id}`}  className="nav-item nav-link">{item1.brand_name}</a>
                        ))
                        }  
                           {/*} <div className="nav-item dropdown">
                                <a href={url} className="nav-link dropdown-toggle" data-toggle="dropdown">Pages <i className="fa fa-angle-down mt-1"></i></a>
                                <div className="dropdown-menu bg-primary rounded-0 border-0 m-0">
                                    <a href={url} className="dropdown-item">Shopping Cart</a>
                                    <a href={url} className="dropdown-item">Checkout</a>
                                </div>
                               </div>
                           */}
                            <a href="/Contact" className="nav-item nav-link">Contact</a>
                        </div>
                       {/* <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
                            <a href={url} className="btn px-0">
                                <i className="fas fa-heart text-primary"></i>
                                <span className="badge text-secondary border border-secondary rounded-circle" style={{paddingBottom:"2px"}}> 0</span>
                            </a>
                            <a href={url} className="btn px-0 ml-3">
                                <i className="fas fa-shopping-cart text-primary"></i>
                                <span className="badge text-secondary border border-secondary rounded-circle" style={{paddingBottom:"2px"}}> 0</span>
                            </a>
                        </div> */}
                    </div>
                </nav>
            </div>
        </div>
    </div>
    </> 
    );
}
export default Navbar;
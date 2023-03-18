import React from "react";
import { BrowserRouter, Route, Routes, Link, useNavigate, Outlet, } from 'react-router-dom';

function Navbaradmin(){
    let url="";
    const navigate = useNavigate();
    const admin_token = localStorage.getItem("admin_token");
    
    const handleLogout = () => {
     localStorage.removeItem("admin_token"); 
      navigate('/admin')
     }
    
    return( 
    <>
    <div className="container-fluid bg-dark mb-30">
        <div className="row px-xl-5">
            <div className="col-lg-9">
                <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
                    <a href={url} className="text-decoration-none d-block d-lg-none">
                        <span className="h1 text-uppercase text-dark bg-light px-2">Multi</span>
                        <span className="h1 text-uppercase text-light bg-primary px-2 ml-n1">Shop</span>
                    </a>
                    <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                        <div className="navbar-nav mr-auto py-0">
                        {
                                admin_token?  <Link to="/admin/Dashboard" className="nav-link">Dashboard</Link>: ""
                        }
                        {
                                admin_token?  <Link to="/admin/Brand" className="nav-link">Brand</Link> : ""
                        }
                        {
                                admin_token? <Link to="/admin/Category" className="nav-link">Category</Link>  : ""
                        }
                        {
                                admin_token? <Link to="/admin/Subcategory" className="nav-link">Sub category</Link> : ""
                        }
                        {
                                admin_token? <Link to="/admin/Product" className="nav-link">Product</Link>  : ""
                        }
                        {
                                admin_token? <Link to="/admin/Productprice" className="nav-link">Product price</Link>  : ""
                        }
                        {
                                admin_token? <Link to="/admin/Settings" className="nav-link">Settings</Link>  : ""
                        }
                        {
                                admin_token? <Link to="/admin/Users" className="nav-link">Users</Link>  : ""
                        }
                        {
                                admin_token? <Link to="/admin/Enquiries" className="nav-link">Enquiries</Link>   : ""
                        }
                        {
                                admin_token? <Link onClick={handleLogout} className="nav-link">Logout</Link>   : ""
                        }
                       
                     </div>         
                    </div>
                </nav>
            </div>
        </div>
    </div>
    </> 
    );
}
export default Navbaradmin;
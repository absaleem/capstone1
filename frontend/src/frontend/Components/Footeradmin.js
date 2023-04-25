import React from "react";

function Footeradmin(){
   return( 
    <>
       <div className="container-fluid bg-dark text-secondary mt-5 pt-5">
        <div className="row px-xl-5 pt-5">
            <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
                <h5 className="text-secondary text-uppercase mb-4">Get In Touch</h5>
                <p className="mb-4">Item Catalog Private Limited,</p>
                <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3"></i>Redmond, New York, USA</p>
                <p className="mb-2"><i className="fa fa-envelope text-primary mr-3"></i>info@itemcatalogue.com</p>
                <p className="mb-0"><i className="fa fa-phone-alt text-primary mr-3"></i>+012 345 67890</p>
            </div>
            
        </div>
        <div className="row border-top mx-xl-5 py-4" style={{borderColor: "rgba(256, 256, 256, .1) !important"}}>
            <div className="col-md-6 px-xl-0">
                <p className="mb-md-0 text-center text-md-left text-secondary">
                    &copy; <a className="text-primary" href={"/"}>ABS</a>. All Rights Reserved.                    
                </p>
            </div>
            <div className="col-md-6 px-xl-0 text-center text-md-right">
                <img className="img-fluid" src="img/payments.png" alt=""/>
            </div>
        </div>
    </div>

    
    </> 
    );
}

export default Footeradmin;
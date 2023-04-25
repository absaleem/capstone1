import React,{useState,useEffect} from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

function Carousel(){

    const [home_slider1,setCarousel1]=useState(''); 
    const [home_slider2,setCarousel2]=useState(''); 
    const [home_slider3,setCarousel3]=useState(''); 
    const [home_slider4,setCarousel4]=useState(''); 
 

    useEffect(() => {

        async function getData(rowId){
           const response = await axios.get(`https://item-catalog-webservice.onrender.com/Catalog/getSettings/${rowId}`);  
           const response1 = response.data.settings_details;
           setCarousel1(response1.home_slider1);
           setCarousel2(response1.home_slider2);
           setCarousel3(response1.home_slider3);
           setCarousel4(response1.home_slider4);
           } 
           getData('6396f5b18d3ca2485a0f0411');//call user data when loading the file     
        
         },[]);
        
   return( 
    <>
  <div className="container-fluid mb-3">
        <div className="row px-xl-5">
            <div className="col-lg-12">
                <div id="header-carousel" className="carousel slide carousel-fade mb-30 mb-lg-0" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#header-carousel" data-slide-to="0" className="active"></li>
                        <li data-target="#header-carousel" data-slide-to="1"></li>
                        <li data-target="#header-carousel" data-slide-to="2"></li>
                        <li data-target="#header-carousel" data-slide-to="3"></li>
                    </ol>
                    
                    <div className="carousel-inner">
                        <div className="carousel-item position-relative active" style={{height:"430px"}}>
                            <img alt={"img"} className="position-absolute w-100 h-100" src={home_slider1} style={{objectFit:"cover"}}/>
                        </div>
                        <div className="carousel-item position-relative" style={{height:"430px"}}>
                            <img alt={"img"} className="position-absolute w-100 h-100" src={home_slider2} style={{objectFit:"cover"}}/>
                        </div>
                        <div className="carousel-item position-relative" style={{height:"430px"}}>
                            <img alt={"img"} className="position-absolute w-100 h-100" src={home_slider3} style={{objectFit:"cover"}}/>
                        </div>
                        <div className="carousel-item position-relative" style={{height:"430px"}}>
                            <img alt={"img"} className="position-absolute w-100 h-100" src={home_slider4} style={{objectFit:"cover"}}/>
                        </div>
                    </div>
                   
                </div>
            </div>
           {/*<div className="col-lg-4">
                <div className="product-offer mb-30" style={{height:"200px"}}>
                    <img className="img-fluid" src="../themes/frontend/img/img/offer-1.jpg" alt=""/>
                    <div className="offer-text">
                        <h6 className="text-white text-uppercase">Save 20%</h6>
                        <h3 className="text-white mb-3">Special Offer</h3>
                        <a href="" className="btn btn-primary">Shop Now</a>
                    </div>
                </div>
                <div className="product-offer mb-30" style={{height:"200px"}}>
                    <img className="img-fluid" src="img/offer-2.jpg" alt=""/>
                    <div className="offer-text">
                        <h6 className="text-white text-uppercase">Save 20%</h6>
                        <h3 className="text-white mb-3">Special Offer</h3>
                        <a href="" className="btn btn-primary">Shop Now</a>
                    </div>
                </div>
            </div>*/}
        </div>
    </div>

    <div className="container-fluid pt-5">
        <div className="row px-xl-5 pb-3">
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div className="d-flex align-items-center bg-light mb-4" style={{ padding:"30px"}}>
                    <h1 className="fa fa-check text-primary m-0 mr-3">-</h1>
                    <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div className="d-flex align-items-center bg-light mb-4" style={{ padding:"30px"}}>
                    <h1 className="fa fa-shipping-fast text-primary m-0 mr-2">-</h1>
                    <h5 className="font-weight-semi-bold m-0">Free catalogue</h5>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div className="d-flex align-items-center bg-light mb-4" style={{ padding:"30px"}}>
                    <h1 className="fas fa-exchange-alt text-primary m-0 mr-3">-</h1>
                    <h5 className="font-weight-semi-bold m-0">Quick Access</h5>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div className="d-flex align-items-center bg-light mb-4" style={{ padding:"30px"}}>
                    <h1 className="fa fa-phone-volume text-primary m-0 mr-3">-</h1>
                    <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
                </div>
            </div>
        </div>
    </div>
 

    </> 
    );
}

export default Carousel;
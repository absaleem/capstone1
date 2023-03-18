import React,{useState,useEffect} from "react";

import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Topbar from './Components/Topbar';

import axios from "axios";
import { useNavigate,useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DefaultEditor } from 'react-simple-wysiwyg';
import { Rating } from 'react-simple-star-rating'
import Moment from 'react-moment';

function Productdetail(){

    const params = useParams();  const navigate = useNavigate();

    const user_token = localStorage.getItem("user_token");
    const user_id = localStorage.getItem("user_id");
    const user_name = localStorage.getItem("user_name");
    
    const [user_rating, setRating] = useState();
    const [total_reviews, setTotalreview] = useState();
    const [avg_review, setAveragereview]=useState();

    const handleRating = (rate) => {
        setRating(rate); //console.log(rate);
    }
    // Optional callback functions
    //const onPointerEnter = (value, index) =>setRating(value);
    //const onPointerLeave = (value, index) =>setRating(value);
    //const onPointerMove = (value, index) => setRating(value);

  const [productList,setProductdata]=useState({  
    id:'',
    product_name: '',
    product_description: '',
    product_specification: '',
    product_image: '',
    product_price: '',
    product_discount_price: '',
    cat_sub_cat_id:'',});
  const [reviewList,setReviewdata]=useState([]);
  const [user_description, setUserdescription] = useState();
  const [html_editor, setHtml] = useState('');
  const [html_editor1, setHtml1] = useState('');
 
  const handleChange =(e)=>{
    setUserdescription(e.target.value);
  }
  const handlereviewSubmit= async (e)=>{
    e.preventDefault();
    if(user_rating!=""){
        try {
            const response=await axios.post("http://localhost:3001/Catalog/createProductreview", {"review_details":{
                    product_id:productList.id,
                    user_id:user_id,
                    rating:user_rating,
                    description:user_description,
                }
            }); 
            setRating(0);   setUserdescription('');
            toast(response.data.msg);  
            getProductreview(productList.id);
          }catch(error){
             toast(error.response.data.msg);  
          }
    }else{
        toast('Please select rating');
    } 
  }
    async function getProductreview(rowId){
        const response = await axios.get(`http://localhost:3001/Catalog/getProductreview/${rowId}`);
        const response1 = response.data;
        setTotalreview(response1[0].length);
        setReviewdata(response1);  
        setAveragereview(response1[1][0].ratingAvg); 
    }    
   useEffect(() => {
    try{
        async function getProductreview(rowId){
            const response = await axios.get(`http://localhost:3001/Catalog/getProductreview/${rowId}`);
            const response1 = response.data;
            setTotalreview(response1[0].length);
            setReviewdata(response1);  
            setAveragereview(response1[1][0].ratingAvg); 
            }  
            getProductreview(params.id);   
          }catch(error){
        }    
    try{
        async function getData(rowId){
            const response = await axios.get(`http://localhost:3001/Catalog/getProductdetail/${rowId}`);
            const response1 = response.data.product_details[0];
            
            setHtml(response1.product_specification);
            setHtml1(response1.product_description);      
            setProductdata({...productList,
                    id:response1._id,
                    product_name: response1.product_name,
                    product_description: response1.product_description,
                    product_specification: response1.product_specification,
                    product_image: response1.product_image,
                    product_price: response1.product_price,
                    product_discount_price: response1.product_discount_price,
                    cat_sub_cat_id:response1.cat_sub_cat_id
            }); 
            }     
            getData(params.id); //call user data when loading the file
          }catch(error){
        
          }
        
    },[]);
   return( 
    <> 
    <Topbar/>
    <Navbar/>
    <div className="container-fluid">
    <div><ToastContainer /></div>
        <div className="row px-xl-5">
            <div className="col-12">
                <nav className="breadcrumb bg-light mb-30">
                    <a className="breadcrumb-item text-dark" href="/">Home</a>
                    <a className="breadcrumb-item text-dark" href="/Products">Product</a>
                    <span className="breadcrumb-item active">{productList.product_name}</span>
                </nav>
            </div>
        </div>
    </div>
    <div className="container-fluid pb-5">
        <div className="row px-xl-5">
            <div className="col-lg-5 mb-30">
                <div id="product-carousel" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner bg-light">
                        <div className="carousel-item carousel-item-center active">
                            <img style={{width:"563px !important", height:"563px !important"}} className="w-50 h-50" src={productList.product_image} alt="Image"/>
                        </div>
                       
                    </div>
                    <a className="carousel-control-prev" href="#product-carousel" data-slide="prev">
                        <i className="fa fa-2x fa-angle-left text-dark"></i>
                    </a>
                    <a className="carousel-control-next" href="#product-carousel" data-slide="next">
                        <i className="fa fa-2x fa-angle-right text-dark"></i>
                    </a>
                </div>
            </div>

            <div className="col-lg-7 h-auto mb-30">
                <div className="h-100 bg-light p-30">
                    <h3>{productList.product_name}</h3>
                    <div className="d-flex mb-3">
                
                                            <div className="text-primary mb-2">
                                             { avg_review && avg_review?"":"No Reviews Yet"}
                                             { avg_review>0 && avg_review?(<i className="fas fa-star"></i> ):""}
                                             { avg_review>1 && avg_review?(<i className="fas fa-star"></i> ):""}
                                             { avg_review>2 && avg_review?(<i className="fas fa-star"></i> ):""}
                                             { avg_review>3 && avg_review?(<i className="fas fa-star"></i> ):""}
                                             { avg_review>4 && avg_review?(<i className="fas fa-star"></i> ):""}
                                            </div>
                                            <h5 class="mb-3">({total_reviews}) </h5>
                    </div>
                    <h3 className="font-weight-semi-bold mb-4">${productList.product_discount_price}</h3>
                    <h6 className="font-weight-semi-bold mb-4">M.R.P.&nbsp;&nbsp; <del>${productList.product_price}</del></h6>
                    <p>Inclusive of all taxes</p>
                    <div className="d-flex mb-4">
                    <DefaultEditor value={html_editor1} />
                   </div>   
                </div>
            </div>
        </div>
        <div className="row px-xl-5">
            <div className="col">
                <div className="bg-light p-30">
                    <div className="nav nav-tabs mb-4">
                        <a className="nav-item nav-link text-dark active" data-toggle="tab" href="#tab-pane-1">Specification</a>
                        <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-2">Reviews ({total_reviews})</a>
                    </div>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="tab-pane-1">
                            <h4 className="mb-3">Specification</h4>
                            <DefaultEditor value={html_editor}  />
                        </div>
                        <div className="tab-pane fade" id="tab-pane-2">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="mb-4">{total_reviews} reviews </h4>
                                    { reviewList.length > 0 && reviewList[0].map((item) => ( 
                                    <div className="media mb-4">
                                        <img src={item.profile_picture_link} alt="Image" className="img-fluid mr-3 mt-1" style={{width:"45px"}} />
                                        <div className="media-body">
                                            <h6>{item.user_name}<small> - <i><Moment titleFormat="DD MM YYYY" withTitle>{item.created_datetime}</Moment></i></small></h6>
                                            <div className="text-primary mb-2" key={item._id}>
                                             { item.rating>0 && item.rating?(<i className="fas fa-star"></i> ):""}
                                             { item.rating>1 && item.rating?(<i className="fas fa-star"></i> ):""}
                                             { item.rating>2 && item.rating?(<i className="fas fa-star"></i> ):""}
                                             { item.rating>3 && item.rating?(<i className="fas fa-star"></i> ):""}
                                             { item.rating>4 && item.rating?(<i className="fas fa-star"></i> ):""}
                                            </div>
                                            <p>{item.description} </p>
                                          </div>
                                    </div>
                                    ))}
                                </div>
                                <div className="col-md-6">
                                    <h4 className="mb-4">Leave a review</h4>
                                    <small>Your email address will not be published. Required fields are marked *</small>
                                    <form onSubmit={(e)=>handlereviewSubmit(e)}>
                                    <div className="d-flex my-3">
                                        <p className="mb-0 mr-2">Your Rating * :</p>
                                        <Rating onClick={handleRating} initialValue={user_rating}  /* Available Props *//>
                                    </div>
                                    <div className="form-group">
                                            <label for="message">Your Review *</label>
                                            <textarea id="user_description" value={user_description}  onChange={(e) => handleChange(e)}  name="user_description" cols="30" rows="5" required className="form-control"></textarea>
                                            <p className="help-block text-danger"></p>
                                     </div>
                                     <div className="form-group mb-0">
                                            <input type={ `${user_name?"submit":"button"}` } value={ `${user_name?"Leave Your Review":"Login to Review"}` } className="btn btn-primary px-3"/>
                                     </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="container-fluid py-5">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Related Products You May Also Like</span></h2>
        <div className="row px-xl-5">
            <div className="col">
                <div className="owl-carousel related-carousel">
                    <div className="product-item bg-light">
                        <div className="product-img position-relative overflow-hidden">
                            <img className="img-fluid w-100" src="img/product-1.jpg" alt=""/>
                            <div className="product-action">
                                <a className="btn btn-outline-dark btn-square" href=""><i className="fa fa-shopping-cart"></i></a>
                                <a className="btn btn-outline-dark btn-square" href=""><i className="far fa-heart"></i></a>
                                <a className="btn btn-outline-dark btn-square" href=""><i className="fa fa-sync-alt"></i></a>
                                <a className="btn btn-outline-dark btn-square" href=""><i className="fa fa-search"></i></a>
                            </div>
                        </div>
                        <div className="text-center py-4">
                            <a className="h6 text-decoration-none text-truncate" href="">Product Name Goes Here</a>
                            <div className="d-flex align-items-center justify-content-center mt-2">
                                <h5>$123.00</h5><h6 className="text-muted ml-2"><del>$123.00</del></h6>
                            </div>
                            <div className="d-flex align-items-center justify-content-center mb-1">
                                <small className="fa fa-star text-primary mr-1"></small>
                                <small className="fa fa-star text-primary mr-1"></small>
                                <small className="fa fa-star text-primary mr-1"></small>
                                <small className="fa fa-star text-primary mr-1"></small>
                                <small className="fa fa-star text-primary mr-1"></small>
                                <small>(99)</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Footer/>
    </> 
    
    );
}

export default Productdetail;
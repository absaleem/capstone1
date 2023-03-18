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
    
    const [user_rating, setRating] = useState()
    const [total_reviews, setTotalreview] = useState()
   
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
        setTotalreview(response1.length);
        setReviewdata(response1);
        //console.log(response1);
        /*setReviewdata({...reviewList,
            id:response1._id,
            rating: response1.rating,
            product_name: response1.product_name,
            description: response1.description,
            user_id: response1.user_id,
            user_name: response1.user_name,
            created_datetime:response1.created_datetime
    });*/ 
    }    
   useEffect(() => {
    try{
        async function getProductreview(rowId){
            const response = await axios.get(`http://localhost:3001/Catalog/getProductreview/${rowId}`);
            const response1 = response.data;
            setTotalreview(response1.length);
            setReviewdata(response1);  
            }  
            getProductreview(params.id);   
          }catch(error){
        
        }
    
    try{
        async function getData(rowId){
            const response = await axios.get(`http://localhost:3001/Catalog/getProductdetail/${rowId}`);
            const response1 = response.data.product_details[0];
            console.log('saleem=',response1);
            
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
                        <div className="carousel-item active">
                            <img style={{width:"563px !important", height:"563px !important"}} className="w-100 h-100" src={productList.product_image} alt="Image"/>
                        </div>
                       
                    </div>
                    {/*<a className="carousel-control-prev" href="#product-carousel" data-slide="prev">
                        <i className="fa fa-2x fa-angle-left text-dark"></i>
                    </a>
                    <a className="carousel-control-next" href="#product-carousel" data-slide="next">
                        <i className="fa fa-2x fa-angle-right text-dark"></i>
                    </a>*/}
                </div>
            </div>

            <div className="col-lg-7 h-auto mb-30">
                <div className="h-100 bg-light p-30">
                    <h3>{productList.product_name}</h3>
                    <div className="d-flex mb-3">
                    { reviewList.length > 0 && reviewList.map((item) => ( 
                                            <div className="text-primary mb-2">
                                             { item.rating>0 && item.rating?(<i className="fas fa-star"></i> ):""}
                                             { item.rating>1 && item.rating?(<i className="fas fa-star"></i> ):""}
                                             { item.rating>2 && item.rating?(<i className="fas fa-star"></i> ):""}
                                             { item.rating>3 && item.rating?(<i className="fas fa-star"></i> ):""}
                                             { item.rating>4 && item.rating?(<i className="fas fa-star"></i> ):""}
                                            </div>
                                    ))}
                        <small className="pt-1">({total_reviews} Reviews)</small>
                    </div>
                    <h3 className="font-weight-semi-bold mb-4">${productList.product_discount_price}<h5 className="font-weight-semi-bold mb-4"><del>${productList.product_price}</del></h5></h3>
                    <h4 className="mb-3">Product Highlights</h4>
                            <DefaultEditor value={html_editor1} />
                    <div className="d-flex mb-4">
                        <strong className="text-dark mr-3">Colors:</strong>
                        <form>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" id="color-1" name="color"/>
                                <label className="custom-control-label" for="color-1">Black</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" id="color-2" name="color"/>
                                <label className="custom-control-label" for="color-2">White</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" id="color-3" name="color"/>
                                <label className="custom-control-label" for="color-3">Red</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" id="color-4" name="color"/>
                                <label className="custom-control-label" for="color-4">Blue</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" id="color-5" name="color"/>
                                <label className="custom-control-label" for="color-5">Green</label>
                            </div>
                        </form>
                    </div>
                    {/*div className="d-flex align-items-center mb-4 pt-2">
                        <div className="input-group quantity mr-3" style={{width:"130px"}}>
                            <div className="input-group-btn">
                                <button className="btn btn-primary btn-minus">
                                    <i className="fa fa-minus"></i>
                                </button>
                            </div>
                            <input type="text" className="form-control bg-secondary border-0 text-center" value="1"/>
                            <div className="input-group-btn">
                                <button className="btn btn-primary btn-plus">
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <button className="btn btn-primary px-3"><i className="fa fa-shopping-cart mr-1"></i> Add To
                            Cart</button>
                        </div>
                    <div className="d-flex pt-2">
                        <strong className="text-dark mr-2">Share on:</strong>
                        <div className="d-inline-flex">
                            <a className="text-dark px-2" href="">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a className="text-dark px-2" href="">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a className="text-dark px-2" href="">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a className="text-dark px-2" href="">
                                <i className="fab fa-pinterest"></i>
                            </a>
                        </div>
                    </div>*/}
                </div>
            </div>
        </div>
        <div className="row px-xl-5">
            <div className="col">
                <div className="bg-light p-30">
                    <div className="nav nav-tabs mb-4">
                        <a className="nav-item nav-link text-dark active" data-toggle="tab" href="#tab-pane-1">Highlights</a>
                        <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-2">Specification</a>
                        <a className="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-3">Reviews ({total_reviews})</a>
                    </div>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="tab-pane-1">
                            <h4 className="mb-3">Product Highlights</h4>
                            <DefaultEditor value={html_editor1} />
                        </div>
                        <div className="tab-pane fade" id="tab-pane-2">
                            <h4 className="mb-3">Specification</h4>
                            <DefaultEditor value={html_editor}  />
                        </div>
                        <div className="tab-pane fade" id="tab-pane-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="mb-4">{total_reviews} reviews </h4>
                                    { reviewList.length > 0 && reviewList.map((item) => ( 
                                    <div className="media mb-4">
                                        <img src={item.profile_picture_link} alt="Image" className="img-fluid mr-3 mt-1" style={{width:"45px"}} />
                                        <div className="media-body">
                                            <h6>{item.user_name}<small> - <i><Moment titleFormat="DD MM YYYY" withTitle>{item.created_datetime}</Moment></i></small></h6>
                                            <div className="text-primary mb-2">
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

    <Footer/>
    </> 
    
    );
}

export default Productdetail;
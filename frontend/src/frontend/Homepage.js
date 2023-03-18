import React from "react";
import Carousel from "./Components/Carousel";
import Clients from "./Components/Clients";
import Featuredproducts from "./Components/Featuredproducts";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Topbar from './Components/Topbar';

function Homepage(){
   return( 
    <>
    <Topbar/>
    <Navbar/>
    <Carousel/>
    <Clients/>
    {<Featuredproducts/>}
    <Footer/>
    </> 
    );
}

export default Homepage;
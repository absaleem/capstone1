import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BackendLogin from './admin/BackendLogin';
import Brand from './admin/Brand';
import Brandedit from './admin/Brandedit';
import Category from './admin/Category';
import Categoryedit from './admin/Categoryedit';
import Subcategory from './admin/Subcategory';
import Subcategoryedit from './admin/Subcategoryedit';
import Product from './admin/Product';
import Productedit from './admin/Productedit';
import Productprice from './admin/Productprice';
import Productpriceedit from './admin/Productpriceedit';
import Settings from './admin/Settings';
import Dashboard from './admin/Dashboard'
import Enquiries from './admin/Enquiries';
import Users from './admin/Users';

import Homepage from './frontend/Homepage';
import Contactpage from './frontend/Contact';
import Searchproduct from './frontend/Searchproduct';
import Register from './frontend/Register'
import Login from './frontend/Login';
import Forgotpassword from './frontend/Forgotpassword';
import Resetpassword from './frontend/Resetpassword';
import Myaccount from './frontend/Myaccount';
import Products from './frontend/Products';
import Productdetail from './frontend/Productdetail';

function App() {

  return (
    <>
       <BrowserRouter> 
          <Routes>
              <Route path="/" element={<Homepage/>} />    
              <Route path='/Register' element={<Register/>} />
              <Route path='/Login' element={<Login/>} />
              <Route path='/Resetpassword/:token' element={<Resetpassword/>} />
              <Route path='/Forgotpassword' element={<Forgotpassword/>} />
              <Route path='/Myaccount/:id' element={<Myaccount/>} />
              <Route path="/contact" element={<Contactpage/>} />    
              <Route path="/Products/:id" element={<Products/>} />    
              <Route path="/Searchproduct" element={<Searchproduct/>} />    
              <Route path="/Productdetail/:id" element={<Productdetail/>} />   
              <Route path="/admin/" element={<BackendLogin/>} />
              <Route path="/admin/Dashboard" element={<Dashboard/>} />
              <Route path="/admin/Brand" element={<Brand/>} />
              <Route path="/admin/Brandedit/:id" element={<Brandedit/>} />
              <Route path="/admin/Category" element={<Category/>} />
              <Route path="/admin/Categoryedit/:id" element={<Categoryedit/>} />
              <Route path="/admin/Subcategory" element={<Subcategory/>} />
              <Route path="/admin/Subcategoryedit/:id" element={<Subcategoryedit/>} />
              <Route path="/admin/Product" element={<Product/>} />
              <Route path="/admin/Productedit/:id" element={<Productedit/>} />
              <Route path="/admin/Productprice" element={<Productprice/>} />
              <Route path="/admin/Productpriceedit/:id" element={<Productpriceedit/>} />
              <Route path='/admin/Enquiries' element={<Enquiries/>}/>
              <Route path='/admin/Users' element={<Users/>}/>
              <Route path="/admin/Settings/" element={<Settings/>} />
              
                  
          </Routes>
       </BrowserRouter>  
    </>
  );
}

export default App;

const express = require("express");
const cors = require("cors");
const dotenv=require("dotenv");
const Categoryrouter = require("./router/Categoryrouter");
const mongo_connection = require("./connect");

dotenv.config();
mongo_connection.connect();

const app=express();
app.use(cors());

app.use(express.json());

//app.use('/register',registerrouter); 
//app.use('/admin',adminrouter); 
app.use('/Catalog',Categoryrouter); 
app.get("/", (req, res) =>
  res.send(`Server Running`)
);
//app.use('/auth',auth.authenticateUser); 
//app.listen(process.env.PORT);
app.listen(process.env.PORT, () => console.log(`Server started in the port ${process.env.PORT}`));

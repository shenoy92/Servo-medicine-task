const express = require('express');
const mongoose=require('mongoose')
const cors=require('cors')
const postRoutes=require('./controller.js')
const dotenv=require('dotenv')
const app= express();

dotenv.config();
app.use(express.json()); 
app.use(express.urlencoded({extented:true}));
app.use(cors());
app.use('/', postRoutes)

mongoose.connect(process.env.url,{useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => app.listen( process.env.PORT || 3200, () => console.log(`Server Running `)))
    .catch((error) => console.log(`${error} did not connect`));

const mongodbConnection = mongoose.connection;
mongodbConnection.on('open',function() {
    console.log('Mongo DB connected');
})



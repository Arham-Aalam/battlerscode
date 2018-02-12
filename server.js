const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
const path = require('path');
const apis = require('./controllers/apis/apis');
var app = express();

mongoose.connect(config.database, function(){
  console.log("connected to the database");
});

// middlewares
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/public/views'));

//require apis
apis(app);

//listening
app.listen(config.port, function(err){
    if(err)
        console.log('error ' +err);
    else
    console.log("listening to the port 3000");
});

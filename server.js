var express     = require('express');
var app         = express();
var http = require('http').Server(app);
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var responseGenerator = require('./libs/responseGenerator');
var port        = process.env.PORT || 3000;
var path = require ('path');
var cors = require('cors')
app.use(express.static(path.join(__dirname, '/client')));
// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// log to console
app.use(morgan('dev'));

//CORS
app.use(cors());

//Application level middleware
app.use(function(req,res,next){
  var logs = {'Time of Request': Date.now(),
        'Requested Url'  : req.originalUrl,
        'Base Url'       : req.baseUrl,
        'Ip address'     : req.ip,
        'Method'         :req.method
  };
  console.log(logs);
  next();
});

// fs module, by default module for file management in nodejs
var fs = require('fs');


// include controllers
fs.readdirSync('./app/controllers').forEach(function(file){
  if(file.indexOf('.js')){
    // include a file as a route variable
    var route = require('./app/controllers/'+file);
    //call controller function of each file and pass your app instance to it
    route.controllerFunction(app);

  }

});//end for each

 
// bundle our routes
var apiRoutes = express.Router();

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

//Error handler
app.use(function(err,req,res,next){
    
    if(res.status==404){
        var myResponse = responseGenerator.generate(true,"Page not Found",404,null);
        console.log("fdjfdk");
        res.sendFile(path.join(__dirname, '/client/views/error404.html'));
    }  
});
 
 
// Start the server
app.listen(port,function(){
    console.log("Server running on port "+port);
});


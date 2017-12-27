var express = require('express');
var app         = express();
var fetch = require('node-fetch');
var http = require('http').Server(app);
var events = require('events');
var eventEmitter = new events.EventEmitter();
var numberRouter  = express.Router();
var responseGenerator = require('./../../libs/responseGenerator');
var calculateFrequency = require('./../../libs/calculateFrequency');

//Export controller function
module.exports.controllerFunction = function(app) {

    //Create a number
    numberRouter.post('/send',function(req,res){

        //Verify body parameters
        if(req.body.number!=undefined){
            //Do something
            fetch('http://terriblytinytales.com/test.txt')
                .then(function(res) {
                    return res.text();
                    //return res.text();
                }).then(function(data) {
                    var string = data;
                    var response = calculateFrequency.calculate(string,req.body.number);
                    var myResponse = responseGenerator.generate(false,'Got Number and calculated result',200,null,response);
                    res.json(myResponse);
            });   

        }
        //Fields not filled up
        else{
            var myResponse = {
                error: true,
                message: "Please fill up all the fields",
                status: 403,
                data: null
            };

            //res.send(myResponse);
            console.log(myResponse);
            res.json(myResponse);

        }
        

    });//end create number


    //Delete number by id
    numberRouter.post('/delete/:numberId',function(req,res){
        
        //Remove number
        numberModel.remove({'_id':req.params.numberId},function(err,number){
            if(err){
                var myResponse = responseGenerator.generate(true,err.message,err.code,null,null);
                console.log(myResponse);
                res.json(myResponse);
             }
            else
            {
                var myResponse = responseGenerator.generate(false,"Successfully deleted number",200,null,null);
                console.log(myResponse);
                res.json(myResponse);
            }
        });//end remove


    });//end delete number


    //Get all numbers
    numberRouter.get('/all',function(req,res){

        //begin number find
        numberModel.find({},function(err,allnumbers){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error",err.code,null,null);          
                res.json( {myResponse});
            }
            else{
                if(allnumbers == null || allnumbers == undefined || allnumbers.length == 0)
                {
                    var myResponse = responseGenerator.generate(false,"No numbers found",200,null,null);
                    console.log(myResponse);
                    res.json(myResponse);
                }
                else
                {
                    var myResponse = responseGenerator.generate(false,"Fetched numbers",200,null,allnumbers);
                    console.log(myResponse);
                    res.json(myResponse);
                }         
            }

        });//end number model find 

    });//end get all numbers


    //Get number by id
    numberRouter.get('/view/:numberId',function(req,res){

        //begin number find
        numberModel.findOne({'_id':req.params.numberId},function(err,number){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error",err.code,null,null);          
                res.json( {myResponse});
            }
            else{
                //If number not found
                if(number == null || number == undefined)
                {
                    var myResponse = responseGenerator.generate(false,"No numbers found",200,null,null);
                    console.log(myResponse);
                    res.json(myResponse);
                }
                else
                {
                    //Update number of views and save model
                    number.views=number.views+1;
                    number.save(function(err,number){
                        if(err){
                            var myResponse = responseGenerator.generate(true,err.message,err.code,null,null);
                            console.log(myResponse);        
                        }
                        else{
                            var myResponse = responseGenerator.generate(false,"Updated number of views",200,null,null);
                            console.log(myResponse);
                        }

                    });

                    //If successfully found return response
                    var myResponse = responseGenerator.generate(false,"Fetched numbers",200,null,number);
                    console.log(myResponse);
                    res.json(myResponse);
                }                     
            }

        });//end number model find 

    });//end get number by id


    //Event emitter for email notification
    eventEmitter.on('commentEmail',function(data){
        if(data.to != data.from){
            var text='Hello '+data.name+'! Someone just posted an answer on your Query.Please click on the link below to view the answer - http://localhost:8080/query';
            var html='Hello '+data.name+'! Someone just posted an answer on your Query.Please click on the link below to view the answer - <a href="http://localhost:8080/query/'+data.id+'">http://localhost:8080/query/</a>';
            
            //Send email about answer notification
            resetMailer.send('Localhost',data.to,'Answer Notification',text,html);
        }
    });

    //Event emitter for number status change notification
    eventEmitter.on('statusEmail',function(data){
        var text='Hello '+data.name+'! Your number status has changed to '+data.status+'.Please click on the link below to view the answer - http://localhost:8080/query';
        var html='Hello '+data.name+'! Your number status has changed to '+data.status+'.Please click on the link below to view the answer - <a href="http://localhost:8080/query/'+data.id+'">http://localhost:8080/query/</a>';
        
        //Send email about number status
        resetMailer.send('Localhost',data.to,'number Status changed',text,html);
    });


    //Post a comment on number by number Id
    numberRouter.post('/comment/:numberId',function(req,res){

        //Get name and answer from body        
        var name=req.body.userName;
        var text=req.body.answer;
        var emailSend=req.body.sendEmail;

        //begin number find
        numberModel.findOne({'_id':req.params.numberId},function(err,number){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error",err.code,null,null);      
                console.log(myResponse);   
                res.json( {myResponse});
            }
            else{
                //If number not found
                if(number == null || number == undefined)
                {
                    var myResponse = responseGenerator.generate(false,"No numbers found",200,null,null);
                    console.log(myResponse);
                    res.json(myResponse);
                }
                //If number found
                else
                {
                    var myResponse = responseGenerator.generate(false,"Fetched numbers",200,null,number);
                    console.log(myResponse);

                    //Push the comment in comments array in number model
                    number.comments.push({userName:name,commentText:text});
                    //Save number
                    number.save(function(err,number){
                        if(err){
                            var myResponse = responseGenerator.generate(true,err.message,err.code,null,null);
                            console.log(myResponse);
                            res.json(myResponse);         
                        }
                        else{
                            //Get details for email notification
                            var details = {from:name,to:number.email,name:number.userName,id:number._id};

                            //Emit email notification event
                            if(emailSend)
                            eventEmitter.emit('commentEmail',details);
                            var myResponse = responseGenerator.generate(false,"Comment created Successfully",200,null,null);
                            console.log(myResponse);
                            res.json(myResponse);
                        }

                    });//end number save
                }         
               

            }

        });//end number model find 

    });//end comment post


    //Change status of number
    numberRouter.put('/changeStatus/:numberId',function(req,res){

        //Get new status
        var newStatus = {numberStatus : req.body.numberStatus}

        //begin number find and update
        numberModel.findOneAndUpdate({'_id':req.params.numberId},newStatus,function(err,number){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error",err.code,null,null);      
                console.log(myResponse);   
                res.json( {myResponse});
            }
            else{
                //If number not found
                if(number == null || number == undefined)
                {
                    var myResponse = responseGenerator.generate(false,"No numbers found",200,null,null);
                    console.log(myResponse);
                    res.json(myResponse);
                }
                //If number found
                else
                {
                    //Get details for email notification
                    var details = {to:number.email,status:newStatus.numberStatus,id:number._id,name:number.userName};

                    //Emit email notification event
                    eventEmitter.emit('statusEmail',details);
                    var myResponse = responseGenerator.generate(false,"number Status changed",200,null,null);
                    console.log(myResponse);
                    res.json(myResponse);
                }                        
            }

        });//end number model find 

    });//end number status change    


    //name api
    app.use('/number', numberRouter);



 
};//end contoller code

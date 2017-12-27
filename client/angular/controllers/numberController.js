app.controller('numberController',['$http','$timeout','$scope','$q','numberService','$route',function($http,$timeout,$scope,$q,numberService,$route){
    $scope.query={};
    var main=this;
    this.reverse=false;
    this.showInput=true;
    this.loading=true;
    this.pageSize=10;
    this.count=0;
    this.pagearray=[];

    this.setNavbar = function(){
        $('nav').addClass('second-navbar');
    };


    main.setNavbar();

    //Get tickets    


    //Calculate number of page for page filter
    this.numberOfPages=function(l){
        return Math.ceil(l/main.pageSize);
    };


    //Get tickets
    this.sendNumber = function(numberData){
        this.showInput = false;
        //Send Number
        numberService.sendNumber(this.numberData).then(function(data){

            //Set loading to false
            main.loading = false;
            if(data.data.error)
            {
                //Set error message
                main.errorMessage=data.data.message;
                console.log(main.errorMessage);   
            }
            else
            {   
                //Set all queries
                main.successMessage = data.data.message;
                console.log(main.successMessage);   
                console.log(data.data.data);
                for(var i =0;i<data.data.data.length;i++)
                {
                    var j=i+1;
                    angular.element('#body').append('<tr><td>'+j+'</td><td>'+data.data.data[i].word+'</td><td>'+data.data.data[i].frequency+'</td></tr>');
                }                           
            }
        });
    };

    this.reload = function(){
        $route.reload();
    };




}]);












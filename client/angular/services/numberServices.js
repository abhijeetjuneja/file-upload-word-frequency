//Declare the service

app.factory('numberService',function allData($http){

    var numberFactory={};

    //Factory to send Number
    numberFactory.sendNumber = function(numberData){
        return $http.post('/number/send',numberData);
    };


    return numberFactory;

});
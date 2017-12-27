exports.calculate = function(string,n){
	
	console.log(string);
	var wordOccurrences = {};
	var responseArray = [];
	var wordsArray = string.trim().split(" ");
	for (var i = 0; i < wordsArray.length; i++) {
        wordOccurrences[wordsArray[i].toLowerCase()] = ( wordOccurrences[wordsArray[i].toLowerCase()] || 0 ) + 1;
    }
    var responseArray=[];
    var sortable = [];
	sortable=Object.keys(wordOccurrences).sort(function(a, b) {return wordOccurrences[b] - wordOccurrences[a]});
    for(var i=0;i<n;i++)
    {
    	responseArray.push({word:sortable[i] , frequency : wordOccurrences[sortable[i]]});
    }
	return responseArray;
    
};
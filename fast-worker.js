onmessage = function(e){
	var result = "I'm a fast worker... see, done!";

	setTimeout(function(){
		postMessage(result);
	}, 100);
}
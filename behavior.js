(function(){
	"use strict"
	var frameWindow = document.getElementById('iframe').contentWindow;
	//Print messages from the frame to the console.
	//wait for the iframe to be ready before starting it's work
	attachEvent(frameWindow, "DOMContentLoaded", initFrameBehavior);
	//watch for messages from the iframe
	attachEvent(window, 'message', function(e){
		var result;
		var status = e.data.status;
		if (status === 'success') {
			result = 'The code in that worker was fast! ' + e.data.message;
			console.log("Worker success", e.data);
		} else if (status === 'failed') {
			result = "The code in that worker was slow so it has been terminated and it's results ignored.";
			console.log("Worker failure", e.data);
		}
		document.getElementById("results").innerHTML = '<p>' + result + '</p>';
	});
	
	function initFrameBehavior(){
		var fastButton = document.getElementById("fast-button");
		var slowButton = document.getElementById("slow-button");

		attachEvent(fastButton, 'click', function(){
			frameWindow.postMessage('fast', '*');
		});
		attachEvent(slowButton, 'click', function(){
			frameWindow.postMessage('slow', '*');
		});
	}

	/* util */
	function attachEvent(node, name, callback){
		if (window.addEventListener) {
			node.addEventListener(name, callback);
		} else {
			node.attachEvent('on'+name, callback);
		}
	}
})();

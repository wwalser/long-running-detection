(function(){
	"use strict"

	var mainWindow;
	attachEvent(window, 'message', function (e) {
		mainWindow = e.source;
		
		executeTimedWorker(e.data);
	});

	function executeTimedWorker(speed){
		//our web worker
		var worker = new Worker(speed + '-worker.js');
		//flag to prevent success and failure from running.
		var workerResult = {};

		//it it doesn't come back in 300ms, kill it and move on
		setTimeout(function(){
			if (workerResult.status === undefined) {
				workerResult.status = 'failed'
				worker.terminate();
				mainWindow.postMessage(workerResult, '*');
			}
		}, 300);

		//if it comes back quickly, show the user it's response
		attachEvent(worker, 'message', function(e){
			if (workerResult.status === undefined) {
				workerResult.status = 'success';
				worker.terminate();
				
				//see what the worker had to say
				workerResult.message = e.data;
				//communicate back to the main frame
				mainWindow.postMessage(workerResult, '*');
			}
		});		
		//kick it off
		worker.postMessage('start');
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
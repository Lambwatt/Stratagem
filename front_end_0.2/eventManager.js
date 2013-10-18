//contains queue of changes to be made to the model on a fixed rate. (4x/sec?) contains code to manage event system.

var eventManager = new EventManager();

function countTo3(){

	var stEvent = new function(){
		this.value;
		
		this.init = function(){
			this.value = 0;
		}

		this.step = function(){
			this.value++;
			return this.value>=3;
		}

		this.end = function(){
			alert("param value = "+this.value);
		}
	}
}

var countTo3Function = new StEvent([], countTo3.init, countTo3.step, countTo3.end);

var countTo3Param = new StEvent([],
		 function(){
			this.value = 0;
		},
		function(){
			this.value++;
			return this.value>=3;
		},
		 function(){
			alert("func value = "+this.value);
		});

eventManager.addEvent(countTo3Function);
eventManager.addEvent(countTo3Param);

setInterval(function() {
    //var startTime = (new Date()).getTime();
    eventManager.chechPendingEvents();
		eventManager.step();
		eventManager.finish();
}, 10);



function StEvent(prereqs, init_code, step_code, end_code){
	this.prerqs = prereqs;
	this.init_code = init_code;
	this.step_code = step_code;
	this.end_code = end_code;

	//Checks that all prereq flags are true.
	this.checkPreqs = function(){
		for(var i=0; i<this.prereqs.length; i++){
			if(!this.prereqs[i])
				return false;
		}
		return true;
	}

	//run the start code exactly
	this.start = function(){
		this.init_code();
	}

	//run the step code many times. step code returnes completeness
	this.step = function(){
		return this.step_code();
	}

	//run the clean up code.
	this.end = function(){
		this.end_code();
	}
}

//Event management system. Think about wether paramaters are needed
function EventManager(){
	this.pendingEvents = {};
	this.activeEvents = {};
	this.completeEvents = {};	

	this.addEvent=function(StEvent){
		this.pendingEvents.push(StEvent);
	}

	this.checkPendingEvents = function(){
		for(var i in this.pendingEvents){
			if(this.pendingEvents[i].checkPrereqs){
				this.pendingEvents.start();
				this.activeEvents.push(this.pendingEvents[i]);
				//remove pending event
			}
		}
	}

	this.step = function(){
		for(var i in this.activeEvents){
			if(this.activeEvents[i].step()){
				this.completeEvents.push(this.activeEvents[i]);
				//remove from active events
			}	
		}
	}

	this.finish = function(){
		for(var i in this.completeEvents){
			this.completeEvents[i].end();
			//remove from complete events and delete event
		}
	}
}

function LinkedList(){
	
	function Node(){
		this.next = null;
		this.contents = null;
	}

	this.head = null;

	this.push = function(x){
		if(this.head==null){
			this.head = new Node();
			this.head.contents = x;
		}
		else
		{
			var tmp = new Node();
			tmp.contents = x;
			tmp.next = this.head;
			this.head = tmp;
		}
	}

	this.remove = function(x){
		var tmp = head;i
		//FINISH ME
		if()
		while(tmp!=null){
			if(tmp.contents == x){
				
			}
		}
	}
}

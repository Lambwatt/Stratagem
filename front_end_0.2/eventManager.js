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

//var countTo3Function = new StEvent([], countTo3.init, countTo3.step, countTo3.end);


function generateTestFunc(x){
	return new StEvent([],
		 function(){
			this.value = 0;
		},
		function(){
			this.value++;
			return this.value>=x;
		},
		 function(){
			alert("func value = "+this.value);
		});
}


//eventManager.addEvent(countTo3Function);
eventManager.addEvent(generateTestFunc(3));
eventManager.addEvent(generateTestFunc(5));
eventManager.addEvent(generateTestFunc(7));


for(var i = 0;i<8;i++){
	alert("trip "+i);
	eventManager.checkPendingEvents();
	eventManager.step();
	eventManager.finish();
}
/*
setInterval(function() {
    //var startTime = (new Date()).getTime();
    eventManager.checkPendingEvents();
		eventManager.step();
		eventManager.finish();
}, 10);
*/


function StEvent(prereqs, init_code, step_code, end_code){
	this.prereqs = prereqs;
	this.init_code = init_code;
	this.step_code = step_code;
	this.end_code = end_code;
	//alert("paramters were "+this.prereqs+", "+this.init_code+", "+this.step_code+", "+this.end_code);

	//Checks that all prereq flags are true.
	this.checkPrereqs = function(){
		for(var i=0; i<this.prereqs.length; i++){
			if(!this.prereqs[i])
				return false;
		}
		return true;
	}

	//run the start code exactly
	this.start = function(){
		//alert("values are "+this.prereqs+", "+this.init_code+", "+this.step_code+", "+this.end_code);
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
	this.pendingEvents = [];
	this.activeEvents = [];
	this.completeEvents = [];	

	this.addEvent=function(StEvent){
		this.pendingEvents.push(StEvent);
	}

	this.checkPendingEvents = function(){
		for(var i in this.pendingEvents){
			if(this.pendingEvents[i].checkPrereqs()){
				this.pendingEvents[i].start();
				this.activeEvents.push(this.pendingEvents[i]);
				this.pendingEvents[i]=null;//remove pending event
			}
		}
		this.pendingEvents = [];
	}

	this.step = function(){
		for(var i in this.activeEvents){
			if(this.activeEvents[i]!=null && this.activeEvents[i].step()){
				this.completeEvents.push(this.activeEvents[i]);
				this.activeEvents[i]=null;//remove from active events
			}	
		}
		this.clean();
	}

	this.finish = function(){
		for(var i in this.completeEvents){
			this.completeEvents[i].end();
			this.completeEvents[i];//remove from complete events and delete event
		}
		this.completeEvents = [];
	}

	//write cleaning active function here. Again...
	this.clean = function(){
		//problem occurs here.		
		for(var src=0,dest = 0; src<this.activeEvents.length; src++){
			if(this.activeEvents[src]!=null){
				this.activeEvents[dest++]=this.activeEvents[src];
				if(src>=dest){ this.activeEvents[src]=null; alert("nullified entry "+src);}
			}
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
		if(this.head==null){
			return;
		}
		var tmp = this.head;
		if(tmp.contents === x){
			this.head = tmp.next;
		}
		while(tmp.next!=null){
			if(tmp.next.contents === x){
				tmp.next = tmp.next.next;
				return;
			}
			else
			{
				tmp = tmp.next;
			}
		}
	}

	this.elements = function(){
		var result = [];
		var tmp = this.head;
		while(tmp!=null){
			tesult.push(tmp.contents);
		}
		return result;
	}
}

//contains queue of changes to be made to the model on a fixed rate. (4x/sec?) contains code to manage event system.

function StEvent(prereqs, init_code, step_code, end_code){
	this.prerqs = prereqs;
	this.init_code = init_code;
	this.step_code = step_code;
	this.end_code = end_code;

	//Checks that all prereq flags are true.
	this.checkPreqs = function{
		for(var i=0; i<this.prereqs.length; i++){
			if(!this.prereqs[i])
				return false;
		}
		return true;
	}

	//run the start code exactly
	this.start = function()
		this.start_code();
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

//set interval.

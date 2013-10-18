function moveUnitOneSquare(unit, dir){
	
	var stEvent = new StEvent([],
	function(){},
	function(){
		return false;
	},
	function(){});
	eventManager.add(stEvent);
}

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
			alert("value = "+this.value);
		}
	}
}

var countTo3Function = new STEvent([], countTo3.init, countTo3.step, countTo3.end);

var countTo3Param = new STEvent([],
		 function(){
			this.value = 0;
		},
		function(){
			this.value++;
			return this.value>=3;
		},
		 function(){
			alert("value = "+this.value);
		});

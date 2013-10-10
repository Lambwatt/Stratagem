function moveUnitOneSquare(unit, dir){
	
	var stEvent = new StEvent([],
	function(){},
	function(){
		return false;
	},
	function(){});
	eventManager.add(stEvent);
}

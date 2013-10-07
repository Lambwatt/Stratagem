//track control states and process commands here.

var SelectingTurn = function()
{
    this.clickObject = function(object)
    {
        //nothing
    }
    
    this.clickSquare = function(x,y)
    {
        //nothing
    }
    
    this.clickTurn = function(i)
    {
        setPositionsForTurn(i);
        Game.turn = i;
        Game.state = new SelectingUnit; 
    }
} 

var SelectingUnit = function()
{
     this.clickObject = function(object)
    {
        if(PlayerData.playerNumber == object.player)
        {
            Game.selectedObject = object;
            Game.state = new SelectingPosition;
        }
    }
    
    this.clickSquare = function(x,y)
    {
        //nothing
    }
    
    this.clickTurn = function(i)
    {
        setPositionsForTurn(i);
        Game.turn  = i;
        Game.state = new SelectingUnit;
    }
} 

var SelectingPosition = function()
{
    this.order = new Array();
    this.lastOverX = Game.selectedObject.x;
    this.lastOverY = Game.selectedObject.y;
    

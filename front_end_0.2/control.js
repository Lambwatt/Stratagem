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

    this.saveOrder = function()
    {
        var dirs = [];

        dirs.push(getAngle(Game.selectedObject.x,Game.selectedObject.y,this.order[0].x,this.order[0].y));
        for(var i = 1; i<this.order.length; i++)
        {
            dirs.push(getAngle(this.order[i-1].x,this.order[i-1].y,this.order[i].x,this.order[i].y));
        }
        PlayerData.orders[Game.turn] = new Order(Game.selectedObject.id,dirs);
    }

    //Adjuust orderPath to create the path to the current target square.  Does not consider obstacles.
    //X and Y should be the number in squares, not mouse coords.
    this.enterSquare = function(x,y)
    {
        
        //check that tile is in range
        if(Game.selectedObject.movement >= (Math.abs(x-Game.selectedObject.x)) && Game.selectedObject.movement >= (Math.abs(y-Game.selectedObject.y)))
        {
            //if pointing to center, reset path to blank
            if(x == Game.selectedObject.x && y == Game.selectedObject.y)
            {
                this.order = [];
                return ;
            }
            
            //if pointing to position on path, shorten path to be this point
            for(var i = 0; i< this.order.length; i++)
            {
                if(x == this.order[i].x && y == this.order[i].y)
                {
                    this.order.splice(i+1,this.order.length -1 - i);//keep an eye on this.  It could be wrong.
                    return;
                }
            }
        
            //check that movement has not been used up 
            if(this.order.length < Game.selectedObject.movement)
            {
                this.order.push(new Step(x,y));
            }
            
            else
            {
                var reached = false;
                //try to modify existing path
                for(var i = 1; i<this.order.length; i++)
                {
                    //if in range of tile
//Complete this
                    if( Game.selectedObject.movement - i >= (Math.abs(x-this.order[this.order.length - 1 - i].x)) && Game.selectedObject.movement - i >= (Math.abs(y-this.order[this.order.length -1 - i].y)) )
                    {
                        var tmpX = this.order[this.order.length - i].x;
                        var tmpY = this.order[this.order.length - i].y; 
                        var angle;
                        for(var j = 0; j<i; j++)
                        {
                            angle = getAngle(tmpX,tmpY,x,y);
                            var step = getStepFromAngle(tmpX,tmpY,angle);
                            this.order[this.order.length-i+j] = step;
                        }
                        reached = true;
                    }
                }
                
                //if not possible, start new path from unit position
                if(reached == false)
                {
                     //alert("took route 2");
                    var tmpX = Game.selectedObject.x;
                    var tmpY = Game.selectedObject.y; 
                    var angle;
                    for(var i = 0; i</*this.order.length*/2; i++)
                    {
                        angle = getAngle(tmpX,tmpY,x,y);
                        var step = getStepFromAngle(tmpX,tmpY,angle);
                        this.order[i] = step;
                        tmpX = step.x;
                        tmpY = step.y;
                    }
                }
            }
        }
    }

    this.clickObject = function(object)
    {
        //PlayerData.orders[Game.turn] = this.order;
        this.saveOrder();
        Game.state = new SelectingTurn;
    }
    
    this.clickSquare = function(x,y)
    {
        //PlayerData.orders[Game.turn] = this.order;
        this.saveOrder();
        Game.state = new SelectingTurn;
    }
    
    this.clickTurn = function(i)
    {
        setPositionsForTurn(i);
        Game.turn  = i;
        Game.state = new SelectingUnit;
    }
} 

canvas.addEventListener("click", function(e){
    var click_x = e.pageX - this.offsetLeft;
    var click_y = e.pageY - this.offsetTop;
    if(click_x>=0 && click_x<400 && click_y>=0 && click_y<500)
    {
        process_mouse_click(click_x, click_y);
    }
});

canvas.addEventListener("mousemove", function(e){
    if(Game.state instanceof SelectingPosition)
    {
        var overX = Math.floor((e.pageX - this.offsetLeft)/100);
        var overY = Math.floor((e.pageY - this.offsetTop)/100);
        if(overX != Game.state.lastOverX || overY != Game.state.lastOverY)
        {
            Game.state.enterSquare(overX, overY); 
            Game.state.lastOverX = overX;
            Game.state.lastOverY = overY;
        }
    }
});
    

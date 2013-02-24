window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

var PlayerData = new function PlayerData()
{
    this.playerNumber = 1;//not used yet.
    this.orders = new Array();
    for(var i = 0;i<3; i++)
    {
        this.orders.push(null);
        this.orders.push(null);
        this.orders.push(null);
    }
}

var Step = function(x,y){
    this.x = x;
    this.y = y;
}

var Unit = function(){
   this.image = document.getElementById("Blue");
   this.turn = 0;
   this.x = 2;
   this.y = 1;
   this.width = 32;
   this.height = 32;
   this.maxOrders = 3;//may not be necessary
   this.movement = 2;
}

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
       Game.turn = i;
       Game.state = new SelectingUnit; 
    }
} 

var SelectingUnit = function()
{
     this.clickObject = function(object)
    {
        Game.selectedObject = object;
        Game.state = new SelectingPosition;
    }
    
    this.clickSquare = function(x,y)
    {
        //nothing
    }
    
    this.clickTurn = function(i)
    {
        Game.turn  = i;
        Game.state = new SelectingUnit;
    }
} 

var SelectingPosition = function()
{
    order = new Array();
    
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
                order = [];
            }
            
            //if pointing to position on path, shorten path to be this point
            for(var i = 0; i< order.length; i++)
            {
                if(x == order[i].x && y == order[i].y)
                {
                    order.splice(i,order.length - i);
                }
            }
        
            //check that movement has not been used up
            if(order.length < Game.selectedObject.movement)
            {
                order.push(new Step(x,y));
            }
            else
            {
                var reached = false;
                //try to modify existing path
                for(var i = 1; i<=order.length; i++)
                {
                    //if in range of tile
                    if( Game.selectedObject.movement - i >= (Math.abs(x-order[order.length - i].x)) && Game.selectedObject.movement - i >= (Math.abs(y-order[order.length - i].y)) )
                    {
                        var tmpX = order[order.length - i].x;
                        var tmpY = order[order.length - i].y; 
                        var angle;
                        for(var j = 0; j<i; j++)
                        {
                            angle = getAngle(tmpX,tmpY,x,y);
                            switch(angle)
                            {
                                case 0:
                                    tmpX++;
                                    order[order.length-i+j] = new Step(tmpX,tmpY);
                                    break;
                                case 45:
                                    tmpX++;
                                    tmpY--;
                                    order[order.length-i+j] = new Step(tmpX,tmpY);
                                    break;
                                case 90:
                                    tmpY--;
                                    order[order.length-i+j] = new Step(tmpX,tmpY);
                                    break;
                                case 135:
                                    tmpX--;
                                    tmpY--;
                                    order[order.length-i+j] = new Step(tmpX,tmpY);
                                    break;
                                case 180:
                                    tmpX--;
                                    order[order.length-i+j] = new Step(tmpX,tmpY);
                                    break;
                                case 225:
                                    tmpX--;
                                    tmpY++;
                                    order[order.length-i+j] = new Step(tmpX,tmpY);
                                    break;
                                case 270:
                                    tmp++;
                                    order[order.length-i+j] = new Step(tmpX,tmpY);
                                    break;
                                case 315:
                                    tmpX++;
                                    tmpY++;
                                    order[order.length-i+j] = new Step(tmpX,tmpY);
                                    break;
                                case 360:
                                    tmpX++;
                                    order[order.length-i+j] = new Step(tmpX,tmpY);
                                    break;
                            }
                        }
                        reached = true;
                    }
                }
                
                //if not possible, start new path from unit position
                if(reached == false)
                {
                    var tmpX = Game.selectedObject.x;
                    var tmpY = Game.selectedObject.y; 
                    var angle;
                    for(var i = 0; i<order.length; i++)
                    {
                        angle = getAngle(tmpX,tmpY,x,y);
                        switch(angle)
                        {
                            case 0:
                                tmpX++;
                                order[i] = new Step(tmpX,tmpY);
                                break;
                            case 45:
                                tmpX++;
                                tmpY--;
                                order[i] = new Step(tmpX,tmpY);
                                break;
                            case 90:
                                tmpY--;
                                order[i] = new Step(tmpX,tmpY);
                                break;
                            case 135:
                                tmpX--;
                                tmpY--;
                                order[i] = new Step(tmpX,tmpY);
                                break;
                            case 180:
                                tmpX--;
                                order[i] = new Step(tmpX,tmpY);
                                break;
                            case 225:
                                tmpX--;
                                tmpY++;
                                order[i] = new Step(tmpX,tmpY);
                                break;
                            case 270:
                                tmp++;
                                order[i] = new Step(tmpX,tmpY);
                                break;
                            case 315:
                                tmpX++;
                                tmpY++;
                                order[i] = new Step(tmpX,tmpY);
                                break;
                            case 360:
                                tmpX++;
                                order[i] = new Step(tmpX,tmpY);
                                break;
                        }
                    }
                }
            }
        }
        Game.state.lastOverX = tmpX;
        Game.state.lastOVerY = tmpY;
    }

    this.clickObject = function(object)
    {
        PlayerData.orders[Game.turn] = order;
        Game.state = new SelectingTurn;
    }
    
    this.clickSquare = function(x,y)
    {
        PlayerData.orders[Game.turn] = order;
        Game.state = new SelectingTurn;
    }
    
    this.clickTurn = function(i)
    {
        Game.turn  = i;
        Game.state = new SelectingUnit;
    }
} 

var Game = new function Game() 
{
	var instance = this;
    var gameObjects = new Array();
    var player1Objects = new Array();
    var player2Objects = new Array();
    var turn = 0;
    var seslectedObject = null;
    this.state = new SelectingTurn();
    
	this.getInstance = function()
	{
		return instance;
	}
    
    this.getGameObjects = function(){
        return gameObjects;
    }
    
    this.removeGameObject = function(dyingObject)
    {
        for(var i = 0; i < gameObjects.length; i++)
        {
            if(gameObjects[i] == dyingObject)
            {
                gameObjects.splice(i,1);
                break;
            }
        }
        
        if(dyingObject.player == 1)
        {
            for(var i = 0; i < player1Objects.length; i++)
            {
                if(player1Objects[i] == dyingObject)
                {
                    player1Objects.splice(i,1);
                    break;
                }
            }
        }
        else
        {
            for(var i = 0; i < player2Objects.length; i++)
            {
                if(player2Objects[i] == dyingObject)
                {
                    player2Objects.splice(i,1);
                    break;
                }
            }
        }
    }
    
    this.addGameObject = function(newObject)
    {
        gameObjects.push(newObject);
        if(newObject.player == 1)
        {
            player1Objects.push(newObject);
        }
        else if(newObject.player == 2)
        {
            player2Objects.push(newObject);
        }
        else
        {
            //do nothings
        }
    }
}

function animate(canvas, context, i)
{
    var width = 4;
    var height = 4;

    //var board = [[0,0,0][0,0,0][0,0,0]];

    var hurskal = document.getElementById("Hurskal");

    //draw 
    for(var x = 0;x<width;x++)
    {
        for(var y = 0;y<height;y++)
        {
            if((x+y)%2==0)
            {
                context.fillStyle = "rgb(255,0,0)";
            }
            else
            {
                context.fillStyle = "rgb(0,255,0)";
            }
            context.fillRect(x*100,y*100,100,100);
        }
    }
    
    var game = Game.getInstance();
    
    //draw game objects
    var objects = game.getGameObjects()
    for(var i = 0; i<objects.length; i++)
    {
        var image = objects[i].image;
        var x = (100 * objects[i].x) + 34;
        var y = (100 * objects[i].y) + 34;
        //alert(image +" "+x+" "+y+" ");
        context.drawImage(image, x, y);
    }
    
    //draw turns
    
    for(var i = 0; i<3; i++)
    {
        context.strokeStyle = "rgb(0,0,0)";
        if(PlayerData.orders[i]==null)
        {
            context.fillStyle = "rgb(0,0,255)";
        }
        else
        {
            context.fillStyle = "rgb(255,0,0)";
        }
        context.fillRect(i*100,400,100,100);
        context.strokeRect(i*100,400,100,100);
    }
    
    context.fillStyle = "rgb(0,255,0)";
    context.fillRect(300,400,100,100);
    context.strokeRect(300,400,100,100);
    
    if(Game.state instanceof SelectingPosition)
    {   
        context.strokeStyle = "rgb(0,0,0)";
        context.moveTo(Game.selectedObject.x, Game.selectedObject.y);
        for(var j = 0; j< Game.state.order.length; j++)
        {
            context.lineTo(Game.state.order[j].x,Game.state.order[j].y);
            context.moveTo(Game.state.order[j].x,Game.state.order[j].y);
        }
    }
    i++;
}

function process_mouse_click(cx, cy)
{
    var game = Game.getInstance();
    var objects = game.getGameObjects();
    var x,y;
    
    if(cy < 400)
    {
        alert("entered section");
        var tookAction = false;
        for(var i = 0; i<objects.length; i++){
            x = (100 * objects[i].x) + 34;
            y = (100 * objects[i].y) + 34;
            alert("x = "+x+" cx = "+cx+" objects[i].width = "+(x+objects[i].width)+" y = "+y+" cy = "+cy+" objects[i].height = "+(y+objects[i].height));
            if(cx > x && cx < x + objects[i].width && cy > y && cy < y + objects[i].height)
            {   
                alert("passed conditions");
                game.state.clickObject(objects[i]);
                tookAction = true;
            }
        }
        if(tookAction == false)
        {
            game.state.clickSquare(Math.floor(cx/100), Math.floor(cy/100));
        }
    }
    else
    {
        //alert("cx = "+cx+" cy = "+cy);
        for(var i = 0; i<3; i++){
            if(cx > i*100 && cx < (i+1)*100)
            {
                //alert("hit clickTurn");
                Game.state.clickTurn(i);
            }
        }
        if(cx > 300 && cx < 400 )
        {
            submitMoves();
        }
    }
}

function submitMoves()
{
    //TODO: stuff
}

//code imported from game maker.
function getAngle(xo, yo, xd, yd)
{
    var x = xd - xo;
    var y = yd - yo;
    
    var angle = 0;
    if(x == 0)
    {
     if(y > 0){ angle = 180;}
     else if(y < 0){ angle = 0; }
    }
    else if (y == 0)
    {
     if(x > 0){ angle = 270;}
     else if(x < 0){angle = 90; }
    }
    else
    {
     //var tmp_angle;
     var tmp_angle = Math.atan(Math.abs(y)/Math.abs(x)) * 180 / pi;

     var rem = tmp_angle % 45;
     if(Math.floor(rem/22) < 1)
     {
            tmp_angle -= rem;
     }else{
            tmp_angle += (45-rem);
     }
         //var switch_var;
         switch_var = 0;
         if(x>0){ switch_var+=1;}
         if(y>0){ switch_var+=2;}

         switch(switch_var)
         {
          case 0:          //quadrant 2
               angle = 90 - tmp_angle;
               break;
          case 1:          //quadrant 1
               angle = 270 +  tmp_angle;
               break;
          case 2:          //quadrant 3
               angle = 90 +  tmp_angle;
               break;
          case 3:          //quadrant 4
               angle = 270 - tmp_angle;
               break;
         }
    }
    return angle;
    
}

//main
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

Game.getInstance().addGameObject(new Unit());

var orders = new Array();

canvas.addEventListener("click", function(e){
    var click_x = e.pageX - this.offsetLeft;
    var click_y = e.pageY - this.offsetTop;
    if(click_x>=0 && click_x<400 && click_y>=0 && click_y<500)
    {
        process_mouse_click(click_x, click_y);
    }
});

canvas.addEventListener("mouseover", function(e){
    if(Game.state == SelectingPosition)
    {
        var overX = Math.floor((e.pageX - this.offsetLeft)/100);
        var overY = Math.floor((e.pageY - this.offsetTop)/100);
        if(overX != Game.state.lastOverX || overY != Game.state.lastOverY)
        {
            Game.state.enterSquare(overX, overY);
        }
    }
});
setTimeout(function() {
    var startTime = (new Date()).getTime();
    animate(canvas, context, startTime);
}, 1000);

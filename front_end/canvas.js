window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

/*function getPlayerNumber() 

//Baked this information into the page instead.
{
    //will need to fix this for IE need ActiveXObject for correct mode
    var request = new XMLHttpRequest();
    alert("running getPlayerNumber function");
    document.getElementById("result").innerHTML = 0;
    /*request.onreadystatechange = function()
    {
        alert("running stateChange function");
        document.getElementById("result").innerHTML = 0;
        alert(request.readyState);
        if(request.readyState==4 && request.status == 200)
        {
            alert(request.responseText);
            var jsonString = "("+request.responseText+")"
            var jsonData = eval(jsonString);
            document.getElementById("result").innerHTML = jsonData.playerNumber;
        }
    }
    request.open("GET","http://localhost:4567/getPlayerNumber",false);
    
    /*if(request.readystate==4 && request.status == 200)
    {
        alert(request.responseText);
        
        var jsonString = "("+request.responseText+")";
        alert("json = "+jsonResponse);
        var jsonResponse = eval(jsonString);
        document.getElementById("result").innerHTML = output;
    //}
    request.send();
    
    return document.getElementById("result").innerHTML;
    
}*/  

//Animation code

//Initialization

var actualSpriteSheet = document.getElementById("smiley");
var sheet = new SpriteSheetAnimationSet();
sheet.addFrameStrip("smiley", 0, 0, 16, 16, 0, 16, 4);
//alert(sheet.frameSetCount);
sheet.addAnimation("smiley", "smiley", [0,1,2,3,2,1]);

//var happyFace = sheet.getAnimationInstance("smiley", 4, true);

function movementAnimation(start_x, start_y, end_x, end_y, dir, speed/*, caller*/){

	alert("ran animation code");
	this.x = start_x;
  this.y = start_y;
  this.speed = speed;
  this.targetX = end_x;
  this.targetY = end_y;
	this.animation = sheet.getAnimationInstance("smiley", 4, true);//caller sprite 
	this.ticks = 0;
	this.ended = false;
  
  this.move = function(dir)
  {
          this.x+= Math.cos(dir);
          this.y+= Math.sin(dir);   
	}
    
  this.update = function()
  {
    for(var i = 0; i<this.speed; i++)
    {
      var dx = this.targetX-this.x;
      var dy = this.targetY-this.y;

      if(Math.sqrt(dx*dx+ dy*dy)>1)
      {
        //alert("dx = "+dx+", dy = "+dy)               	
				this.move(Math.atan2(this.targetY-this.y,(this.targetX-this.x)));
      }
      else
      {
					animation.setLoop(false);
          this.ended = true;
      }
    }        
  }
    
 	this.setTarget = function(x,y)
  {
    this.targetX = x;
    this.targetY = y;
	}
	
	this.draw = function(context, spriteSheet){
		alert("tried to draw");
		this.ticks++;
		this.animation.getCurrentFrame(context, this.ticks, spriteSheet, this.x, this.y, 16, 16);
		this.update();
	}
	alert("finished animation code");
}
//End animation code


var PlayerData = new function PlayerData()
{
    var jsonString = "("+document.getElementById("result").value+")";
    var jsonResponse = eval(jsonString);
    this.playerNumber = jsonResponse.playerNumber;
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

var Order = function(id, dirs)
{
    this.id = id;
    this.dirs = dirs;
}

var Unit = function(p,x,y){
   
  //this.turn = 0; See if this breaks anything
  this.id = Game.getId();
  //alert("id assigned was "+this.id);
  this.startX = x;
  this.x = x;
  this.startY = y;
  this.y = y;
  this.width = 32;
  this.height = 32;
  this.maxOrders = 3;//may not be necessary
  this.movement = 2;
  this.player = p;
	this.animation = null;
  if(this.player==1)
  {
   this.image = document.getElementById("Blue");
  }
  else
  {
   this.image = document.getElementById("Red");
  }
	
	this.animated = function(){
		if(this.animation==null){alert("failed"); return false;}
		alert("succeeded, reult = "+this.animation.ended);
		return !this.animation.ended;
	}

	this.animateMovement = function(dest_x, dest_y){
		this.animation = new movementAnimation(this.x, this.y, dest_x, dest_y, 5);
	}
}

function runOrder(order)
{
    var unit = Game.getObjectById(order.id);
    var step;
    for(var i = 0;i<order.dirs.length; i++)
    {
        step = getStepFromAngle(unit.x, unit.y, order.dirs[i]);
        unit.x = step.x;
        unit.y = step.y;
    }
}

function setPositionsForTurn(n)
{
    var units = Game.getPlayerObjects(PlayerData.playerNumber)
    for(var i = 0; i<units.length; i++)
    {
        units[i].x = units[i].startX;
        units[i].y = units[i].startY;
    }
    for(var i = 0;i<n;i++)
    {
        if(PlayerData.orders[i] == null)
            return;
        else
            runOrder(PlayerData.orders[i]);
    }
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


var Game = new function Game() 
{
	var instance = this;
    var gameObjects = new Array();
    var player1Objects = new Array();
    var player2Objects = new Array();
    var turn = 0;
    var id = 0;
    var seslectedObject = null;
    this.state = new SelectingTurn();
    
    this.getId = function()
    {
        return id++;
    }
    
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
    
    this.getObjectById = function(id)
    {
        for(var i = 0; i <= id && i < gameObjects.length; i++)
        {
            if(gameObjects[i].id==id)
                return gameObjects[i];
        }
        return null;
    }
    
    this.getPlayerObjects = function(i)
    {
        if(i == 1)
        {
            return player1Objects;
        }
        else if(i == 2)
        {
            return player2Objects;
        }

    }
}


function animate(canvas, context, i)
{
    var width = 4;
    var height = 4;

    //var board = [[0,0,0][0,0,0][0,0,0]];

    //var hurskal = document.getElementById("Hurskal");

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
				if(objects[i].animated())
				{
					alert("tried to animate for animated object");
					objects[i].animation.draw(context, actualSpriteSheet);
				}
				else{
        	var image = objects[i].image;
        	var x = (100 * objects[i].x) + 34;
        	var y = (100 * objects[i].y) + 34;
        	context.drawImage(image, x, y);
				}
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
        context.fillStyle = "rgb(0,0,0)";
        //context.strokeStyle = "rgb(0,0,0)";
        context.moveTo(Game.selectedObject.x, Game.selectedObject.y);
        for(var j = 0; j< Game.state.order.length; j++)
        {
            /*context.lineTo(Game.state.order[j].x,Game.state.order[j].y);
            context.moveTo(Game.state.order[j].x,Game.state.order[j].y);*/
            context.fillRect((Game.state.order[j].x*100)+25,(Game.state.order[j].y*100)+25,50,50);
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
        var tookAction = false;
        for(var i = 0; i<objects.length; i++){
            x = (100 * objects[i].x) + 34;
            y = (100 * objects[i].y) + 34;
            if(cx > x && cx < x + objects[i].width && cy > y && cy < y + objects[i].height)
            {   
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
        for(var i = 0; i<3; i++){
            if(cx > i*100 && cx < (i+1)*100)
            {
                Game.state.clickTurn(i);
            }
        }
        if(cx > 300 && cx < 400 )
        {
            submitMoves();
        }
    }
}

function getStepFromAngle(tmpX, tmpY, angle)
{
    var step;
    switch(angle)
    {
        case 0:
            tmpX++;
            step = new Step(tmpX,tmpY);
            break;
        case 45:
            tmpX++;
            tmpY--;
            step = new Step(tmpX,tmpY);
            break;
        case 90:
            tmpY--;
            step = new Step(tmpX,tmpY);
            break;
        case 135:
            tmpX--;
            tmpY--;
            step = new Step(tmpX,tmpY);
            break;
        case 180:
            tmpX--;
            step = new Step(tmpX,tmpY);
            break;
        case 225:
            tmpX--;
            tmpY++;
            step = new Step(tmpX,tmpY);
            break;
        case 270:
            tmpY++;
            step = new Step(tmpX,tmpY);
            break;
        case 315:
            tmpX++;
            tmpY++;
            step = new Step(tmpX,tmpY);
            break;
        case 360:
            tmpX++;
            step = new Step(tmpX,tmpY);
            break;
    }
    return step;

}

function submitMoves()
{
    //TODO: stuff
    
}


function getAngle(xo, yo, xd, yd)
{
    var x = xd - xo;
    var y = yd - yo;
    
    var angle = 0;
    if(x == 0)
    {
     if(y > 0){ angle = 270;}
     else if(y < 0){ angle = 90; }
    }
    else if (y == 0)
    {
     if(x > 0){ angle = 0;}
     else if(x < 0){angle = 180; }
    }
    else
    {

     var tmp_angle = Math.atan(Math.abs(y)/Math.abs(x)) * 180 / Math.PI;

     var rem = tmp_angle % 45;
     if(Math.floor(rem/22) < 1)
     {
            tmp_angle -= rem;
     }else{
            tmp_angle += (45-rem);
     }

     var switch_var = 0;
     if(x>0){ switch_var+=1;}
     if(y>0){ switch_var+=2;}
     switch(switch_var)
     {
      case 0:          //quadrant 2
           angle = 90 + tmp_angle;
           break;
      case 1:          //quadrant 1
           angle = 0 +  tmp_angle;
           break;
      case 2:          //quadrant 3
           angle = 180 +  tmp_angle;
           break;
      case 3:          //quadrant 4
           angle = 270 + tmp_angle;
           break;
     }
    }
    return angle;
    
}

//main
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

Game.getInstance().addGameObject(new Unit(1,2,1));
Game.getInstance().addGameObject(new Unit(2,0,3));

var orders = new Array();

var tester = Game.getObjectById(0);

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

setInterval(function() {
    var startTime = (new Date()).getTime();
    animate(canvas, context, startTime);
    
}, 30);


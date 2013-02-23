window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

var Unit = function(){
   var image = document.getElementById("Hurskal");
   var x = 2;
   var y = 1;
}

var Game = new function Game() 
{
	var instance = this;
    var gameObjects = new Array();
    var player1Objects = new Array();
    var player2Objects = new Array();
    
	this.getInstance = function()
	{
		return instance;
	}
    
    this.getGameObjects = function(){
        return gameObjects;
    }
    
    this.removeGameObject = function(dyingObject){
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
 
        var width = 3;
        var height = 3;

        var board = [[0,0,0][0,0,0][0,0,0]];

        var hurskal = document.getElementById("Hurskal");

        
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
        
        var objects = game.getGameObjects()
        for(var i = 0; i<objects.length; i++)
        {
            context.drawImage(objects[i].image,(100 * objects[i].x) + 18,(100 * objects[i].y) + 18);
        }
    i++;
}

function process_mouse_click(cx, cy)
{

}

//main
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

Game.getInstance().addGameObject(new Unit());

var orders = new Array();

canvas.addEventListener("click", function(e){
   var click_x = e.pageX - this.offsetLeft;
   var click_y = e.pageY - this.offsetTop;
   
   alert("listener triggered.  click_x = "+click_x+", click_y = "+click_y);
   if(click_x>=0 && click_x<300 && click_y>=0 && click_y<300)
   {
    process_mouse_click(click_x, click_y);
   }
});

setTimeout(function() {
    var startTime = (new Date()).getTime();
    animate(canvas, context, startTime);
}, 1000);

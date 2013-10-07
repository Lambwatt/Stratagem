window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

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
					//alert("tried to animate for animated object");
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


setInterval(function() {
    var startTime = (new Date()).getTime();
    animate(canvas, context, startTime);
    
}, 30);

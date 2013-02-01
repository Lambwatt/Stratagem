var width = 3;
var height = 3;

var board = [[0,0,0][0,0,0][0,0,0]];

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

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

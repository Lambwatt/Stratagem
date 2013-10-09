Put your miscelaneous helper algorithms here.

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

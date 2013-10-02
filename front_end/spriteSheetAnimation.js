//alert("started");
function animationFrame(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
}

function SpriteSheetAnimationSet(/*spriteSheet*/){
	//this.sheet = spriteSheet
	this.frameSetList = new Array();
	this.frameSetCount = 0;
	this.animationList = new Array();
	this.animationCount = 0;
	this.addFrameArray = function(name, array){
		//validation: loop over array and confirm all variables present
		//object.hasOwnProperty('membername')
		///alert("frameSetCount"+this.frameSetCount);
		this.frameSetList[this.frameSetCount] = new Array();
		this.frameSetList[this.frameSetCount][0] = name;
		this.frameSetList[this.frameSetCount][1] = array;
		//alert("added "+this.frameSetList[this.frameSetCount][1]);
		this.frameSetCount+=1;
	}

	this.addFrameStrip = function(name, start_x, start_y, width, height, x_inc, y_inc, frames){
		var frameSet = new Array();
		var frame;
	
		for(var i = 0; i<frames; i++){
			frame = new animationFrame(start_x+(i*x_inc), start_y+(i*y_inc),width, height);
			//alert("this frame is " + frame);
			frameSet[i] = frame;
		}

		//alert("frames in "+frameSet);
		this.addFrameArray(name, frameSet);
		//alert("new = "+this.frameSetCount);
	}

	this.addAnimation = function(name, frame_set_name){
		var frames = getFrameSet(frame_set_name);
		//var animation = new Animation();
		this.animationList[this.animationCount] = new Array();
		this.animationList[this.animationCount][0] = name;
		this.animationList[this.animationCount][1] = frames;
		this.animationCount++;
	}

	this.addAnimation = function(name, frame_set_name, sequence){
		var frames = new Array();
		var frame_set = this.getFrameSet(frame_set_name);
		//alert("frame_set = "+frame_set);
		for(var i = 0; i<sequence.length; i++){
			frames[i] = frame_set[sequence[i]];
		}
		//var animation = new Animation(name, frames);
		this.animationList[this.animationCount] = new Array();
		this.animationList[this.animationCount][0] = name;
		this.animationList[this.animationCount][1] = frames;//animation;
		this.animationCount++;
	}

	this.getFrameSet = function(name){
		//alert("there are "+this.frameSetCount+" frames.");
		for(var i = 0; i <this.frameSetCount; i++){
			//alert("compatring "+this.frameSetList[i][0]+" to "+name);
			if(this.frameSetList[i][0] == name)
				return this.frameSetList[i][1];
		}
		return null;
	}

	this.getAnimation = function(name){
		for(var i = 0; i <this.animationCount; i++){
			if(this.animationList[i][0] == name)
				return this.animationList[i][1];
		}
		return null;
	}

	this.getAnimationInstance = function(name, frame_interval, loop){
		return new AnimationInstance(this.getAnimation(name), frame_interval, loop);
	}
}

function AnimationInstance(animation, frame_interval, loop){
	this.animation = animation;
	this.startTime = 0;
	this.frame_interval = frame_interval
	this.num_frames = animation.length; 
	this.loop = loop;

	this.setStart = function(ticks){
		this.startTime = ticks;
	}

	this.setLoop = function(loop){
		this.loop = loop;
	}

	this.getCurrentFrame = function(ticks){
		if(this.loop){
/*			alert("numerator = "+(ticks-this.startTime));
			alert("denominator = "+this.frame_interval);
			alert("modulus term = "+this.num_frames);
			alert("index = "+Math.floor((ticks-this.startTime)/this.frame_interval)%this.num_frames);
			alert("returning "+this.animation[Math.floor((ticks-this.startTime)/this.frame_interval)%this.num_frames]);
			*/return this.animation[Math.floor((ticks-this.startTime)/this.frame_interval)%this.num_frames];
		}else{
			var index = Math.floor((ticks-this.startTime)/this.frame_interval);
			if(index < this.num_frames) 
				return this.animation[index];
			else
				return this.animation[this.num_frames-1];	
		}
	}

	this.drawCurrentFrame = function(context, ticks, img, x, y, width, height){
		var frame = this.getCurrentFrame(ticks);
		//alert("frame = "+frame);
		context.drawImage(img, frame.x, frame.y, frame.width, frame.height, x, y, width, height);
	}

	this.replay = function(ticks){
		this.startTime = ticks;
	}
}

//alert("stoped");

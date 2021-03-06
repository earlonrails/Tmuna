var canvas;
var ctx;
var pointarray=new Array();
var dotindex=0, dotgrab=false;
var i=0;
var image, ptool;
var Text;
var x=0, y=0;
var x1=-1, y1=-1;
var Tool="Line";
var mousedown=false;
function init() {
	canvas = document.getElementById('canvas');
	TempLayer = document.getElementById('TempLayer'); 
	canvas.width=window.innerWidth-25;
	TempLayer.width=window.innerWidth-25;
	canvas.height=window.innerHeight-86;
	TempLayer.height=window.innerHeight-86;
  	if (canvas.getContext){	
 		ctx = canvas.getContext('2d');
		ctx2 = TempLayer.getContext('2d');
	} else {  
  		alert("אין לך תמיכה בקאנבאס בדפדפן. זה אומר שכדאי לשדרג."); 
	}
	SelectTool("FreeLine");
	Load();
	canvas.onmouseout = function(e) {
		x1=-1;
		mousedown=false;
		canvas.style.cursor="";
		document.getElementById('position').innerHTML="Out";
		ClearTemp();		
	}
	canvas.onmousemove = function(e) {
		canvas.style.cursor="";
		ClearTemp();
		UpdateSettings();
		SaveSettings();
		if (e.offsetX) { x = e.offsetX; y = e.offsetY; }
		else if (e.layerX) { x = e.layerX; y = e.layerY }
		document.getElementById('position').innerHTML="X: " + x+", Y: " +y;
		document.getElementById('tool').innerHTML=Tool;
		if (x1!=-1) {	
			switch(Tool) {					
				case "FreeLine":
					DrawLine(x1, y1, x,y);
					x1=x; y1=y;
				break;
				case "Line":
					DrawTempLine(x1, y1, x,y);
				break;
				case "Circle":
					DrawTempCircle(x1, y1, x, y);
				break;
				case "Rect":
					DrawTempRect(x1, y1, x, y);
				break;
				case "Pixelize":
					PixelizeTempRect(x1,y1,x,y);
				break;
				case "Blur":
					BlurTempRect(x1,y1,x,y);
				break;
				case "Noise":
					TempNoise(x1,y1,x,y);
				break;
				case "Triangle":
					DrawTempTriangle(x1, y1, x, y);
				break;
				case "GrayScale":
					GrayScaleRect(x1,y1,x,y,ctx2);
				break;
			}		
		}
		switch (Tool) {
			case "Erase":
				canvas.style.cursor="none";
				ctx2.fillStyle="white";
				ctx2.strokeStyle="black";
				ctx2.lineWidth=1;
				ctx2.globalAlpha=1;
				DrawTempRect(x-25,y-25,x+25,y+25);
				if (mousedown==true) {
					ctx.clearRect(x-25,y-25,50,50);
				}
			break;
			case "Pic":
				canvas.style.cursor="none";
				pich=document.getElementById("pich");
				picw=document.getElementById("picw");
				if (pich.value!="") {
					ctx2.drawImage(image, x, y, picw.value, pich.value);
				} 
				else {
					ctx2.drawImage(image, x, y);
				}
			break;
			case "TextMove":
				canvas.style.cursor="none";
				DrawTempText(x,y, Text);						
			break;
			case "DotToDot":
				if (i!=0) {
					if (!dotgrab) {
						for (var z=0; z<i; z++) {
							if (x>pointarray[z][0]-4 && x<pointarray[z][0]+4 && y>pointarray[z][1]-4 && y<pointarray[z][1]+4) {
								if (mousedown==false) {
									canvas.style.cursor="move";
									canvas.style.cursor="-moz-grab";
								}
								else {
									canvas.style.cursor="move";
									canvas.style.cursor="-moz-grabbing";
									pointarray[z][0]=x;
									pointarray[z][1]=y;
									dotindex=z;
									dotgrab=true;
								}
							}
						}
					}
					else {
						canvas.style.cursor="move";
						canvas.style.cursor="-moz-grabbing";
						pointarray[dotindex][0]=x;
						pointarray[dotindex][1]=y;
					}
				}				
			break;
		}
	}
	canvas.onmousedown=function(e) {
		x1=x;
		y1=y;
		mousedown=true;
		if (Tool=="DotToDot") {
			for (var z=0; z<i; z++) {
				if (x>pointarray[z][0]-4 && x<pointarray[z][0]+4 && y>pointarray[z][1]-4 && y<pointarray[z][1]+3) {
					canvas.style.cursor="move";
					canvas.style.cursor="-moz-grabbing";
					if (e.button==2) {
						e.preventDefault();
						pointarray.splice(z,1);
						i--;
						mousedown=false;
						return false;
					}
				}
			}
		}
		return true;
	}
	canvas.onmouseup=function(e) {
		if (mousedown==false)
			return false;
		mousedown=false;
		canvas.style.cursor="";
		UpdateSettings();
		switch (Tool) {
			case "FreeLine":
			case "Line": 
				DrawLine(x1, y1, x,y);				
			break;
			case "Circle":
				DrawCircle(x1, y1, x, y);
			break
			case "Rect":
				DrawRect(x1, y1, x, y);
			break;						
			case "Text":
				Text=null;
				Text=prompt("הקלד טקסט כאן",""); //FIXME: use something better then prompt here
				if (Text!=null && Text!="") {
					DrawTempText(x,y, Text);
					Tool="TextMove";
				}
			break;
			case "TextMove":
				DrawText(x,y, Text);
				SelectTool("Text");						
			break;
			case "Erase":
				ctx.clearRect(x-25,y-25,50,50);
			break;
			case "Pic":
				pich=document.getElementById("pich");
				picw=document.getElementById("picw");
				if (pich.value!="") {
					ctx.drawImage(image, x, y, picw.value, pich.value);
				} 
				else {
					ctx.drawImage(image, x, y);
				}
				SelectTool(ptool);
			break;
			case "Triangle":
				DrawTriangle(x1, y1, x, y);
			break;
			case "DotToDot":
				if (!dotgrab) {
					pointarray[i]=new Array(2);
					pointarray[i][0]=x;
					pointarray[i][1]=y;
					i++;
					ctx2.fillStyle="blue";
					ctx2.strokeStyle="black";
					ctx2.lineWidth=1;
					ctx2.globalAlpha=0.5;
					DrawTempRect(x-3,y-3,x+3,y+3);							
				}							
			break;
			case "Pixelize":
				PixelizeRect(x1,y1,x,y,ctx);
			break;
			case "Blur":
				BlurRect(x1,y1,x,y,ctx);
			break;
			case "Noise":
				//SaveTemp(x1,y1,x,y);
				Noise(x1,y1,x,y,ctx);
			break;
			case "GrayScale":
				GrayScaleRect(x1,y1,x,y,ctx);
			break;
		}
		x1=-1;
		ClearTemp();
		dotgrab=false;
		Save();
	}
	canvas.addEventListener("dragover", function(event) {
  		event.preventDefault();
	}, true);
	canvas.addEventListener("drop", function(event) {
  		event.preventDefault();
  		ptool=Tool;
		SelectTool("Pic");
		var dataURL;
		if (event.dataTransfer.files.length>0)
			dataURL = event.dataTransfer.files[0].getAsDataURL();
		else
			dataURL=event.dataTransfer.mozSourceNode.href; //FIXME: This hack will only work for dragging links.
  			image = new Image();
			image.src=dataURL;
			ctx2.drawImage(image, x, y);
	}, true);
}
function ClearTemp() {
	ctx2.clearRect(0,0, canvas.width, canvas.height);
	for (var z=0; z<pointarray.length; z++) {
		ctx2.fillStyle="blue";
		ctx2.strokeStyle="black";
		ctx2.lineWidth=1;
		ctx2.globalAlpha=0.5;
		DrawTempRect(pointarray[z][0]-3,pointarray[z][1]-3,pointarray[z][0]+3,pointarray[z][1]+3);
	}
}
function UpdateSettings() {
	fill=document.getElementById("fill");
	stroke=document.getElementById("stroke");
	width=document.getElementById("linesize");
	alpha=document.getElementById("alpha");
	linecap=document.getElementById("round");
	if (fill.value!="") {
		ctx.fillStyle=fill.value;
		ctx2.fillStyle=fill.value;
	} else {
		ctx.fillStyle="transparent";
		ctx2.fillStyle="transparent";
	}
	if (stroke.value!="") {
		ctx.strokeStyle=stroke.value;
		ctx2.strokeStyle=stroke.value;
	} else {
		ctx.strokeStyle="black";
		ctx2.strokeStyle="black";
	}
	if (width.value!="") {
		ctx.lineWidth=width.value;
		ctx2.lineWidth=width.value;
	} else {
		ctx.lineWidth=1;
		ctx2.lineWidth=1;				
	}
	if (alpha.value!="") {
		ctx.globalAlpha=alpha.value;
		ctx2.globalAlpha=alpha.value;
	} else {
		ctx.globalAlpha=1;
		ctx2.globalAlpha=1;
	}
	if (linecap.checked==true && (Tool=="Line" || Tool=="FreeLine")) {
		ctx.lineCap = "round";
		ctx2.lineCap = "round";
	} else {
		ctx.lineCap = "butt";
		ctx2.lineCap = "butt";
	}		
}
function DrawLine(x1,y1,x2,y2) {
	ctx.beginPath();  
	ctx.moveTo(x1,y1);  
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
}
function DrawTempLine(x1,y1,x2,y2) {
	prevlineX=x2;
	prevlineY=y2;
	ctx2.beginPath();  
	ctx2.moveTo(x1,y1);  
	ctx2.lineTo(x2,y2);
	ctx2.stroke();
	ctx2.closePath();
}
function DrawCircle(x1, y1, x2, y2) {			
	radius=Math.abs(x1-x2)+Math.abs(y1-y2);
	ctx.beginPath();
	ctx.arc(x1, y1, radius, 0, (Math.PI/180)*360, false);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}
function DrawTempCircle(x1, y1, x2, y2) {
	radius=Math.abs(x1-x2)+Math.abs(y1-y2);
	ctx2.beginPath();
	ctx2.arc(x1, y1, radius, 0, (Math.PI/180)*360, false);
	ctx2.fill();
	ctx2.stroke();
	ctx2.closePath();
}
function DrawRect(x1,y1,x2,y2) {
	ctx.beginPath();  
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x1, y2);
	ctx.lineTo(x1, y1);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}
function DrawTempRect(x1,y1,x2,y2) {
	ctx2.beginPath();  
	ctx2.moveTo(x1,y1);
	ctx2.lineTo(x2, y1);
	ctx2.lineTo(x2, y2);
	ctx2.lineTo(x1, y2);
	ctx2.lineTo(x1, y1);
	ctx2.fill();
	ctx2.stroke();
	ctx2.closePath();
}
function PixelizeTempRect(x1,y1,x2,y2) {
	DrawTempRect(x1,y1,x2,y2);
	PixelizeRect(x1,y1,x2,y2,ctx2);
}
function PixelizeRect(x1,y1,x2,y2,context) {
	var width, height, realX1, realY1, realX2, realX2;
	if (x1>=x2) {
		width=x1-x2;
		realX1=x2;
		realX2=x1;
	} else {
		width=x2-x1;
		realX1=x1;
		realX2=x2;
	}
	if (y1>=y2) {
		height=y1-y2;
		realY1=y2;
		realY2=y1;
	} else {
		height=y2-y1;
		realY1=y1;
		realY2=y2;
	}
	if (width>1 && height>1) {
		var canvasData = ctx.getImageData(realX1, realY1, width, height);
		for (var y=0; y<height; y+=2) {
			for (var x=0; x<width; x+=2) {
				var matrix=new Array();
				matrix[0]=new Array();
				matrix[1]=new Array();
				matrix[0][0]=getPixel(canvasData, x,y);
				matrix[0][1]=getPixel(canvasData, x,y+1);
				matrix[1][0]=getPixel(canvasData, x+1,y);
				matrix[1][1]=getPixel(canvasData, x+1,y+1);
				//Applying the filter:
				var newPixel=new Array();
				newPixel[0]=parseInt((matrix[0][0][0]+matrix[0][1][0]+matrix[1][0][0]+matrix[1][1][0])/4);
				newPixel[1]=parseInt((matrix[0][0][1]+matrix[0][1][1]+matrix[1][0][1]+matrix[1][1][1])/4);
				newPixel[2]=parseInt((matrix[0][0][2]+matrix[0][1][2]+matrix[1][0][2]+matrix[1][1][2])/4);
				newPixel[3]=parseInt((matrix[0][0][3]+matrix[0][1][3]+matrix[1][0][3]+matrix[1][1][3])/4);
				setPixel(canvasData, x,y, newPixel);
				setPixel(canvasData, x,y+1, newPixel);
				setPixel(canvasData, x+1,y, newPixel);
				setPixel(canvasData, x+1,y+1, newPixel);
			}
		}
		context.putImageData(canvasData, realX1, realY1);
	}
}
function BlurTempRect(x1,y1,x2,y2) {
	DrawTempRect(x1,y1,x2,y2);
	BlurRect(x1,y1,x2,y2,ctx2);
}
function BlurRect(x1,y1,x2,y2,context) { //Box Blur	
	var width, height, realX1, realY1, realX2, realX2;
	if (x1>=x2) {
		width=x1-x2;
		realX1=x2;
		realX2=x1;
	} else {
		width=x2-x1;
		realX1=x1;
		realX2=x2;
	}
	if (y1>=y2) {
		height=y1-y2;
		realY1=y2;
		realY2=y1;
	} else {
		height=y2-y1;
		realY1=y1;
		realY2=y2;
	}
	if (width>1 && height>1) {
		var canvasData = ctx.getImageData(realX1, realY1, width, height);
		for (var y=0; y<height; y++) {
			for (var x=0; x<width; x++) {
				var matrix=new Array();
				matrix[0]=new Array();
				matrix[1]=new Array();
				matrix[0][0]=getPixel(canvasData, x,y);
				matrix[0][1]=getPixel(canvasData, x,y+1);
				matrix[1][0]=getPixel(canvasData, x+1,y);
				matrix[1][1]=getPixel(canvasData, x+1,y+1);
				//Applying the filter:
				var newPixel=new Array();
				newPixel[0]=parseInt((matrix[0][0][0]+matrix[0][1][0]+matrix[1][0][0]+matrix[1][1][0])/4);
				newPixel[1]=parseInt((matrix[0][0][1]+matrix[0][1][1]+matrix[1][0][1]+matrix[1][1][1])/4);
				newPixel[2]=parseInt((matrix[0][0][2]+matrix[0][1][2]+matrix[1][0][2]+matrix[1][1][2])/4);
				newPixel[3]=parseInt((matrix[0][0][3]+matrix[0][1][3]+matrix[1][0][3]+matrix[1][1][3])/4);
				setPixel(canvasData, x,y, newPixel);
				setPixel(canvasData, x,y+1, newPixel);
				setPixel(canvasData, x+1,y, newPixel);
				setPixel(canvasData, x+1,y+1, newPixel);
			}
		}
		context.putImageData(canvasData, realX1, realY1);
	}
}
function GrayScaleRect(x1,y1,x2,y2,context) {
	var width, height, realX1, realY1, realX2, realX2;
	if (x1>=x2) {
		width=x1-x2;
		realX1=x2;
		realX2=x1;
	} else {
		width=x2-x1;
		realX1=x1;
		realX2=x2;
	}
	if (y1>=y2) {
		height=y1-y2;
		realY1=y2;
		realY2=y1;
	} else {
		height=y2-y1;
		realY1=y1;
		realY2=y2;
	}
	if (width>1 && height>1) {
		var canvasData = ctx.getImageData(realX1, realY1, width, height);
		for (var y=0; y<height; y++) {
			for (var x=0; x<width; x++) {
				var pixel=getPixel(canvasData, x,y);
				//Applying the filter:
				var newPixel=new Array();
				newPixel[0]=parseInt((pixel[0]+pixel[1]+pixel[2]+pixel[3])/4);
				newPixel[1]=newPixel[0]
				newPixel[2]=newPixel[0]
				newPixel[3]=0xff;
				setPixel(canvasData, x,y, newPixel);
			}
		}
		context.putImageData(canvasData, realX1, realY1);
	}
}
function setPixel(imageData, x, y, pixel) {
	var index = (x + y * imageData.width) * 4;
	imageData.data[index+0] = pixel[0];
	imageData.data[index+1] = pixel[1];
	imageData.data[index+2] = pixel[2];
	imageData.data[index+3] = pixel[3];
}
function getPixel(imageData, x, y) {
	var index = (x + y * imageData.width) * 4;
	var pixel=new Array();
	pixel[0] = imageData.data[index+0];	//Red
	pixel[1] = imageData.data[index+1];	//Green
	pixel[2] = imageData.data[index+2];	//Blue
	pixel[3] = imageData.data[index+3];	//Alpha
	return pixel;					
}
function TempNoise(x1,y1,x2,y2) {
	DrawTempRect(x1,y1,x2,y2);
	Noise(x1,y1,x2,y2,ctx2);
}
function Noise(x1, y1,x2,y2, context) {
	var width, height, realX1, realY1, realX2, realX2;
	if (x1>=x2) {
		width=x1-x2;
		realX1=x2;
		realX2=x1;
	} else {
		width=x2-x1;
		realX1=x1;
		realX2=x2;
	}
	if (y1>=y2) {
		height=y1-y2;
		realY1=y2;
		realY2=y1;
	} else {
		height=y2-y1;
		realY1=y1;
		realY2=y2;
	}
	if (width>1 && height>1) {
		var canvasData = ctx.getImageData(realX1, realY1, width, height);
		for (var y=0; y<height; y++) {
			for (var x=0; x<width; x++) {
				var pixel=new Array();
				x = parseInt(x);
				y = parseInt(y);
				pixel[0] = parseInt(Math.random() * 256);
				pixel[1] = parseInt(Math.random() * 256);
				pixel[2] = parseInt(Math.random() * 256);
				pixel[3] = parseInt(Math.random() * 256);
				setPixel(canvasData, x, y, pixel);
			}
		}
	context.putImageData(canvasData, realX1, realY1);
	}
}
function SaveTemp(x1,y1,x2,y2) {
	var width, height, TrueX1=x1, TrueX2=x2, TrueY1=y1, TrueY2=y2;
	if (x1>x2) {
		width=x1-x2;
	} else {
		width=x2-x1;
		TrueX1=x2;
		TrueX2=x1;
	}
	if (y1>y2) {
		height=y1-y2;
	} else {
		height=y1;
		TrueY1=y2;
		TrueY2=y1;
	}
	var canvasData = ctx2.getImageData(TrueX1, TrueY1, width, height);
	ctx.putImageData(canvasData, TrueX1, TrueY1);
}
function DrawText(x, y, text) {
	font=document.getElementById("font").value;
	size=document.getElementById("size").value;
	if (font=="")
		font="sans-serif";
	if (size=="")
		size="100px";
	ctx.font=size+" "+font;
	ctx.beginPath();  
	ctx.strokeText(text, x,y);
	ctx.fillText(text, x,y);
	ctx.closePath();
}
function DrawTempText(x, y, text) {
	font=document.getElementById("font").value;
	size=document.getElementById("size").value;
	if (font=="")
		font="sans-serif";
	if (size=="")
		size="100px";
	ctx2.font=size+" "+font;
	ctx2.beginPath();  
	ctx2.strokeText(text, x,y);
	ctx2.fillText(text, x,y);
	ctx2.closePath();
				}
function DrawTriangle(x1, y1,x2,y2) { //TODO: Other triangles, not just right triangle
	ctx.beginPath();  
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x1, y1);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();			
}
function DrawTempTriangle(x1, y1,x2,y2) {
	ctx2.beginPath();  
	ctx2.moveTo(x1,y1);
	ctx2.lineTo(x2, y1);
	ctx2.lineTo(x2, y2);
	ctx2.lineTo(x1, y1);
	ctx2.fill();
	ctx2.stroke();
	ctx2.closePath();			
}
function DotToDotDone() {
	if (i==0)
		return false;
	ctx.beginPath();
	ctx.moveTo(pointarray[0][0], pointarray[0][1]);
	for (var z=1; z<i; z++) {
		ctx.lineTo(pointarray[z][0], pointarray[z][1]);
	}
	ctx.lineTo(pointarray[0][0], pointarray[0][1]);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	pointarray=new Array();
	i=0;
	ClearTemp();
}
function DrawRandom(dots) {
		pointarray=new Array();
		ctx.globalAlpha=Math.random();
		for (var z=0; z<dots; z++) {
			var randX=Math.floor(Math.random()*canvas.width);
			var randY=Math.floor(Math.random()*canvas.height);
			pointarray[z]=new Array(2);
			pointarray[z][0]=randX;
			pointarray[z][1]=randY;
		}
	i=dots;
	DotToDotDone();
}
function Export() {
	DataURL=canvas.toDataURL("image/png");
	window.open(DataURL);
}
function Clear() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	i=0;
	pointarray=new Array();
	ClearTemp();
	localStorage.clear();
	Load();
}
function SelectTool(ToolName) {
	if (ToolName==null) 
		return false;
	fontsettings=document.getElementById("fontsettings");
	picsettings=document.getElementById("picsettings");
	linesettings=document.getElementById("linesettings");
	fontsettings.setAttribute("class", "settings");
	picsettings.setAttribute("class", "settings");
	linesettings.setAttribute("class", "settings");
	Tool=ToolName;
	var MenuArray=document.getElementById("menu").children;
	for (var i=0; i<MenuArray.length;i++) {
		MenuArray[i].removeAttribute("aria-selected");
		if (MenuArray[i].id==ToolName)
			MenuArray[i].setAttribute("aria-selected", true);
	}
	document.getElementById('tool').innerHTML=Tool;
	document.getElementById("dot2dotDone").style.visibility="hidden";
	switch(ToolName) {
		case "Text":
			fontsettings.setAttribute("class", "settingsVis");				
		break;
		case "Pic":
			picsettings.setAttribute("class", "settingsVis");
		break;
		case "FreeLine":
		case "Line":
			linesettings.setAttribute("class", "settingsVis");
		break;
		case "DotToDot":
			document.getElementById("dot2dotDone").style.visibility="";
		break;
	}				
}
function Save() {
	localStorage.setItem("CanvasState", canvas.toDataURL("image/png"));
}
function SaveSettings() { //Save settings to LocalStorage
	UpdateSettings();
	localStorage.setItem("Tool", Tool);
	fill=document.getElementById("fill").value;
	stroke=document.getElementById("stroke").value;
	width=document.getElementById("linesize").value;
	alpha=document.getElementById("alpha").value;
	linecap=document.getElementById("round").checked;
	localStorage.setItem("fill", fill);
	localStorage.setItem("stroke", stroke);
	localStorage.setItem("width", width);
	localStorage.setItem("alpha", alpha);
	localStorage.setItem("linecap", linecap);
}
function Load() { //Load settings from LocalStorage
	document.getElementById('position').innerHTML="Loading";			
	StoredCanvasState=localStorage.getItem("CanvasState");
	if (StoredCanvasState!=null) {
	 	image = new Image();
		image.src=StoredCanvasState;
		ctx.drawImage(image,0,0,canvas.width,canvas.height);
	}
	document.getElementById("fill").value=localStorage.getItem("fill");
	document.getElementById("stroke").value=localStorage.getItem("stroke");
	document.getElementById("linesize").value=localStorage.getItem("width");
	document.getElementById("alpha").value=localStorage.getItem("alpha");
	document.getElementById("round").checked=localStorage.getItem("linecap");
	SelectTool(localStorage.getItem("Tool"));
	UpdateSettings();
	document.getElementById('position').innerHTML="";			
}
function ToggleSettings() {
	SettingsContainer=document.getElementById("SettingsContainer");
	if (SettingsContainer.getAttribute("class")=="hidden")
		SettingsContainer.setAttribute("class", "SettingsContainer");
	else
		SettingsContainer.setAttribute("class", "hidden");
}
function ToggleEval() {
	EvalContainer=document.getElementById("EvalContainer");
	if (EvalContainer.getAttribute("class")=="hidden")
		EvalContainer.removeAttribute("class");
	else
		EvalContainer.setAttribute("class", "hidden");
}

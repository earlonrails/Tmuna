function layer(container, properties) {
    var instance = this;
    this.canvas = document.createElement('canvas');
        
    for (property in properties)
        this.canvas[property] = properties[property];
   
    container.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');

    this.clear = function() {
        instance.context.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
    }
}

function layerManager() {
    var mainLayer = new layer(document.getElementById("canvasLayers"), { 
        id: 'imageView',
        className: 'layer',
        width: window.innerWidth,
        height: window.innerHeight
    });

    var tempLayer = new layer(document.getElementById("canvasLayers"), { 
        id: 'imageTemp',
        className: 'layer',
        width: window.innerWidth,
        height: window.innerHeight 
    });

    new toolManager(tempLayer);

    this.update = function() {
        mainLayer.context.drawImage(tempLayer.canvas, 0, 0);
		tempLayer.clear();
    }
}

var layerManagerInstance;

window.onload=function () {
    layerManagerInstance = new layerManager();
}


				function MenuAnimation() { //Animate menu
					Menu=document.getElementById("ToolMenu");
					if (Menu.getAttribute("class")=="ToolMenu") {
						document.getElementById("MenuTrigger").innerHTML="בחר כלי &#9652;"
						Menu.setAttribute("class", "ToolMenuVis");
					}
					else {
						Menu.setAttribute("class", "ToolMenu");
						document.getElementById("MenuTrigger").innerHTML="בחר כלי &#9662;"
					}
				}

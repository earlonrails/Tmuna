tools.pencil = function(layer) {
    var tool = this;

    this.started = false;
    this.menuButtonText = 'עיפרון';
    
    this.mousedown = function(ev) {
        layer.context.beginPath();
        layer.context.moveTo(ev._x, ev._y);

        tool.started = true;
    };

    this.mousemove = function(ev) {
        if (tool.started) {
            layer.context.lineTo(ev._x, ev._y);
            layer.context.stroke();
        }
    };

    this.mouseup = function(ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;

            layerManagerInstance.update();
        }
    };
};

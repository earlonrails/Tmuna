tools.line = function(layer) {
    var tool = this;

    this.started = false;
    this.menuButtonText = 'קו';

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }

        layer.clear();

        layer.context.beginPath();
        layer.context.moveTo(tool.x0, tool.y0);
        layer.context.lineTo(ev._x,   ev._y);
        layer.context.stroke();
        layer.context.closePath();
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;

            layerManagerInstance.update();
        }
    };
};

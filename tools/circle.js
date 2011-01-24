tools.circle = function(layer) {
    var tool = this;

    this.started = false;
    this.menuButtonText = 'מעגל';

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
        layer.context.arc(tool.x0, tool.y0, Math.abs(tool.x0 - ev._x) + Math.abs(tool.y0 - ev._y), 0, Math.PI * 2, false);
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

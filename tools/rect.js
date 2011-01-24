tools.rect = function(layer) {
    var tool = this;

    this.started = false;
    this.menuButtonText = 'מרובע';

    this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
            return;
        }

        var x = Math.min(ev._x,  tool.x0),
            y = Math.min(ev._y,  tool.y0),
            w = Math.abs(ev._x - tool.x0),
            h = Math.abs(ev._y - tool.y0);

        layer.clear();

        if (!w || !h) {
            return;
        }

        layer.context.strokeRect(x, y, w, h);
    };

    this.mouseup = function (ev) {
        if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;

            layerManagerInstance.update();
        }
    };
};

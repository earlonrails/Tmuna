// an object that holds the implementations of each drawing tool.
var tools = {}; 

    function toolManager(layer) {
        // the active tool instance.
        var tool = false;
        var defaultTool = 'pencil';
     
        initializeToolMenu();

        // activate the default tool
        changeTool(defaultTool);

        layer.canvas.addEventListener('mousedown', ev_canvas, false);
        layer.canvas.addEventListener('mousemove', ev_canvas, false);
        layer.canvas.addEventListener('mouseup', ev_canvas, false);

        function initializeToolMenu() {
            var menu = document.getElementById('ToolMenu');

            for (toolName in tools) {
                var item = document.createElement('div');

                item.textContent = new tools[toolName]().menuButtonText;
                item.className = 'ToolMenuItem';
                item.toolName = toolName;

                item.addEventListener('click', function(ev) {
                    changeTool(this.toolName);
                }, false);

                menu.appendChild(item);
            }
        }

        function changeTool(toolName) { 
            if (tools[toolName]) {
                tool = new tools[toolName](layer);
            }
        }

        function ev_canvas(ev) {
            if (ev.layerX || ev.layerX == 0) { 
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX == 0) { 
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }

            var func = tool[ev.type];

            if (func)
                func(ev);
        }
    };

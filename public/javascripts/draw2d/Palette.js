
app.Palette = Class.extend({
    /**
     * @constructor
     */
    init: function(id, app) {
        var _this = this;
        
        // Create the jQuery-Draggable for the palette -> canvas drag&drop interaction
        //
        $(".draw2d_droppable").draggable({
            appendTo:"body",
            helper:"clone",
            drag: function(event, ui){
                event = app.view._getEvent(event);
                var pos = app.view.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                app.view.onDrag(ui.draggable, pos.getX(), pos.getY(), event.shiftKey, event.ctrlKey);
            },
            stop: function(e, ui){
                console.log("Drag from palette stopped.");
            },
            start: function(e, ui){
                console.log(ui);
                $(ui.helper).addClass("shadow");
            }
        });

        $('.draw2d_droppable')
            .on('mouseover', function(){
                $(this).parent().addClass('glowBorder');
            })
            .on('mouseout', function(){
            $(this).parent().removeClass('glowBorder');
        });
    }
});
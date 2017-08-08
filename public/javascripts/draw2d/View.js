
var scrollAreaId = "#draw2dCanvasWrapper";
var defaultRouter = new ConnectionRouter();//new draw2d.layout.connection.InteractiveManhattanConnectionRouter(); 

app.View = draw2d.Canvas.extend({

    /**
     * @constructor
     */
    init: function(app, id) {
        var _this = this;
        this._super(id);
        this.app = app;

        this.setScrollArea(scrollAreaId);

        // add commandStack support
        this.getCommandStack().addEventListener(this);

        this.fileStorage = new draw2d.storage.LocalFileStorage();

        var router = new ConnectionRouter();
        router.abortRoutingOnFirstVertexNode=false;
        var createConnection=function(sourcePort, targetPort){
            var c = new Connection({
                color:"#000000",
                router: router,
                stroke:1.5,
                radius:2
            });
            if(sourcePort) {
                c.setSource(sourcePort);
                c.setTarget(targetPort);
            }
            return c;
        };

        this.installEditPolicy( new DropInterceptorPolicy());

        // install a Connection create policy which matches to a "circuit like"
        // connections
        //
        this.connectionPolicy = new draw2d.policy.connection.ComposedConnectionCreatePolicy(
                [
                    // create a connection via Drag&Drop of ports
                    //
                    new draw2d.policy.connection.DragConnectionCreatePolicy({
                        createConnection:createConnection
                    }),
                    // or via click and point
                    //
                    new draw2d.policy.connection.OrthogonalConnectionCreatePolicy({
                        createConnection:createConnection
                    })
                ]);
        this.installEditPolicy(this.connectionPolicy);

        // show the ports of the elements only if the mouse cursor is close to the shape.
        //
        this.coronaFeedback = new draw2d.policy.canvas.CoronaDecorationPolicy({diameterToBeVisible:50});
        this.installEditPolicy(this.coronaFeedback);

        // nice grid decoration for the canvas paint area
        //
        this.grid = new draw2d.policy.canvas.ShowGridEditPolicy(20);
        this.installEditPolicy( this.grid);

        // add some SnapTo policy for better shape/figure alignment
        //
        this.installEditPolicy( new draw2d.policy.canvas.SnapToGeometryEditPolicy());
        this.installEditPolicy( new draw2d.policy.canvas.SnapToCenterEditPolicy());
        this.installEditPolicy( new draw2d.policy.canvas.SnapToInBetweenEditPolicy());

        Mousetrap.bind(['left'],function (event) {
            var diff = _this.getZoom()<0.5?0.5:1;
            _this.getSelection().each(function(i,f){f.translate(-diff,0);});
            return false;
        });
        Mousetrap.bind(['up'],function (event) {
            var diff = _this.getZoom()<0.5?0.5:1;
            _this.getSelection().each(function(i,f){f.translate(0,-diff);});
            return false;
        });
        Mousetrap.bind(['right'],function (event) {
            var diff = _this.getZoom()<0.5?0.5:1;
            _this.getSelection().each(function(i,f){f.translate(diff,0);});
            return false;
        });
        Mousetrap.bind(['down'],function (event) {
            var diff = _this.getZoom()<0.5?0.5:1;
            _this.getSelection().each(function(i,f){f.translate(0,diff);});
            return false;
        });

        // button_zoom functions
        var setZoom = function(newZoom){
            var bb = _this.getBoundingBox().getCenter();
            var c = $(scrollAreaId);
            _this.setZoom(newZoom);
            _this.scrollTo((bb.y/newZoom- c.height()/2), (bb.x/newZoom- c.width()/2));
        };

        //  ZoomIn Button and the callbacks
        //
        $("#canvas_zoom_in").on("click",function(){
            setZoom(_this.getZoom()*1.2);
        });

        // OneToOne Button
        //
        $("#canvas_zoom_normal").on("click",function(){
            setZoom(1.0);
        });

        //ZoomOut Button and the callback
        //
        $("#canvas_zoom_out").on("click",function(){
            setZoom(_this.getZoom()*0.8);
        });

        $(".toolbar").delegate("#editUndo:not(.disabled)","click", function(){
            _this.getCommandStack().undo();
        });

        $(".toolbar").delegate("#editRedo:not(.disabled)","click", function(){
            _this.getCommandStack().redo();
        });
    },

    getBoundingBox: function()
    {
        var xCoords = [];
        var yCoords = [];
        this.getFigures().each(function(i,f){
           var b = f.getBoundingBox();
            xCoords.push(b.x, b.x+b.w);
            yCoords.push(b.y, b.y+b.h);
        });
        var minX   = Math.min.apply(Math, xCoords);
        var minY   = Math.min.apply(Math, yCoords);
        var width  = Math.max(100,Math.max.apply(Math, xCoords)-minX);
        var height = Math.max(100,Math.max.apply(Math, yCoords)-minY);

        return new draw2d.geo.Rectangle(minX,minY,width,height);
    },

	/**
     * @method
     * Called if the DragDrop object is moving around.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} droppedDomNode The dragged DOM element.
     * @param {Number} x the x coordinate of the drag
     * @param {Number} y the y coordinate of the drag
     *
     * @template
     **/
    onDrag:function(droppedDomNode, x, y )
    {
    },

    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onDrop : function(droppedDomNode, x, y, shiftKey, ctrlKey)
    {
        var type = $(droppedDomNode).data("shape");
        var isAllowed = this.checkLimit(type); 
        if (isAllowed) {
            var figure = eval("new "+type+"();");
            this.updateRemain(type, -1);
            // create a command for the undo/redo support
            var command = new draw2d.command.CommandAdd(this, figure, x, y);
            this.getCommandStack().execute(command);
        } else {
            alert("Usage is limited.");
        }
    },

    /**
     * Disable snapTo GRID if we have select more than one element
     * @param figure
     * @param pos
     */
    snapToHelper : function(figure, pos)
    {
        if(this.getSelection().getSize()>1){
            return pos;
        }
        return this._super(figure, pos);
    },

    /**
     * @method
     * Transforms a document coordinate to canvas coordinate.
     *
     * @param {Number} x the x coordinate relative to the window
     * @param {Number} y the y coordinate relative to the window
     *
     * @returns {draw2d.geo.Point} The coordinate in relation to the canvas [0,0] position
     * 
     * !! 修改，部件有滑动，x加上垂直滑动
     */
    fromDocumentToCanvasCoordinate: function(x, y)
    {
        return new draw2d.geo.Point(
            (x - this.getAbsoluteX())*this.zoomFactor,
            (y - this.getAbsoluteY() + $('body').scrollTop())*this.zoomFactor);
    },
    
    /**
     * @method
     * Transforms a canvas coordinate to document coordinate.
     *
     * @param {Number} x the x coordinate in the canvas
     * @param {Number} y the y coordinate in the canvas
     *
     * @returns {draw2d.geo.Point} the coordinate in relation to the document [0,0] position
     * 
     * !! 修改，部件有滑动
     */
    fromCanvasToDocumentCoordinate: function(x,y)
    {
        return new draw2d.geo.Point(
            ((x*(1/this.zoomFactor)) + this.getAbsoluteX()),
            ((y*(1/this.zoomFactor)) + this.getAbsoluteY() - $('body').scrollTop()));
    },

    /**
     * @method
     * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail()
     * can be used to identify the type of event which has occurred.
     *
     * @template
     *
     * @param {draw2d.command.CommandStackEvent} event
     **/
    stackChanged:function(event)
    {
        $("#editUndo").addClass("disabled");
        $("#editRedo").addClass("disabled");

        if(event.getStack().canUndo()) {
            $("#editUndo").removeClass("disabled");
        }

        if(event.getStack().canRedo()) {
            $("#editRedo").removeClass("disabled");
        }

        this.changed = true;
    },

    load:function (jsonDocument) {  
        // cleanup the canvas 
        this.clear();
        this.initRemain();
        var _this = this;

        $(jsonDocument).each(function(index, item) {
            // checkLimit
            if (_this.checkLimit(item.type)) {
                _this.updateRemain(item.type, -1);        
            } else {
                alert("Error: " + item.type + " usage is limited.");
            }
        });

        // load the JSON into the canvas
        var reader = new draw2d.io.json.Reader();
        reader.unmarshal(this, jsonDocument);
        this.centerDocument();
    },

    centerDocument:function()
    {
        var bb=null;
        var c = $(scrollAreaId);
        if(this.getFigures().getSize()>0){
            // get the bounding box of the document and translate the complete document
            // into the center of the canvas. Scroll to the top left corner after them
            //
            bb = this.getBoundingBox();
            this.scrollTo(bb.y- c.height()/2,bb.x- c.width()/2);
        }
        else{
            bb={
                x:this.getWidth()/2,
                y:this.getHeight()/2
            };
            this.scrollTo(bb.y- c.height()/2,bb.x- c.width()/2);

        }
    },
});
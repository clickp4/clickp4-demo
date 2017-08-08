
// declare the namespace for this app
var app = {};

var defaultRouterClassName = "draw2d.layout.connection.ManhattanConnectionRouter";
var defaultRouter = new draw2d.layout.connection.ManhattanConnectionRouter();

app.Application = Class.extend({
    NAME: 'ClickP4 Demo',

    /**
     * @constructor
     */
    init: function() {
        var _this = this;
        this.sessionStorage = [];
        
        try {
            if( 'sessionStorage' in window && window.sessionStorage !== null){
                this.sessionStorage = sessionStorage;
            }
        } catch (e) {

        }

        this.view    = new app.View(this, "draw2dCanvas");
		this.toolbar = new app.Toolbar("toolbar", this, this.view);
		this.palette = new app.Palette("navigation", this);
    },

    /**
     * Load the json of a canvas
     */
    load: function(jsonDocument) {
        this.view.clear();

        var reader = new draw2d.io.json.Reader();
        reader.unmarshal(this.view, jsonDocument);
    },

    /**
     * Output json of the canvas
     */
    dump: function() {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(this.view, function(json) {
            console.log(JSON.stringify(json, undefined, 2));
        });
    },

    /**
     * 
     * Set default router for the connections
     * @param {any} defaultRouterClassName
     */
    setDefaultRouterClassName: function(defaultRouterClassName){
	    defaultRouterClassName=  defaultRouterClassName;
        defaultRouter = eval("new "+defaultRouterClassName+"()");
    },

	/**
	 * create a new connection with a default router
	 * 
	 * @returns a new connection
	 */
	createConnection: function(){
	    var conn = new draw2d.Connection();
	    conn.setRouter(defaultRouter);
	    conn.setOutlineStroke(1);
	    conn.setOutlineColor("#303030");
	    conn.setStroke(3);
	    conn.setRadius(5);
	    conn.setColor('#00A8F0');
	    return conn;
	}

});
$(function() {
    // $('body').css('min-height', '0px');
    $('#FunctionButton').click(function() {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(app.view, function(json){
            // json is description data of the canvas, consisting of topo structure and other info
            var code = 'code generated\n' + simplifyJSON(app.view, json); // toCode(simplifyJSON(app.view, json));
            console.log(json);
            alert("This is where function works.");

            // e.g. preview code generated
            // $('#vhdlPreview').text(code);
            
            // or show modal dialog 
            // $('#modalVHDL').modal({
            //     keyboard: true
            // });
        });
    });
});

function simplifyJSON(canvas, circuitJSON) {
    var components = [];
    var connections = [];

    $.each(circuitJSON, function(n, value) {
        if (value.type == "Connection") {
            var v = {};
            v.type = "draw2d.Connection";
            v.id = value.id;
            v.source = value.source;
            v.source.type = canvas.getFigure(v.source.node).cssClass;
            v.target = value.target;
            v.target.type = canvas.getFigure(v.target.node).cssClass;
            connections.push(v);
        } else if (value.type.startsWith("clickp4_")) {
            var v = {};
            v.type = value.type;
            v.id = value.id;
            v.componentInfo = 'no info'; // getComponentInfo(value);
            if (value.labels.length > 0) {
                v.name = value.labels[0].text;
            }
            components.push(v);
        } else {
            var s = value.type + " is not supported";
            console.log(s);
            alert(s);
        }
    });

    var circuit = {};
    circuit.components = components;
    circuit.connections = connections;
    return circuit;
}

// Todo
function topoSort(circuit) {
    var edges = circuit.connections;
    var nodes = circuit.components;

    var L = [];
    for (var i = 0; i < nodes.length; i++) {
        var element = nodes[i];
        
    }
}
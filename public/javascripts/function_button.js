$(function() {
    // $('body').css('min-height', '0px');
    $('#CompileButton').click(function() {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(app.view, function(json){
            // json is description data of the canvas, consisting of topo structure and other info
            var chain  = simplifyJSON(app.view, json); // toCode(simplifyJSON(app.view, json));
            if (typeof(chain) == 'undefined' ) {
                alert("Wrong policy!");
                return;
            }
            console.log(chain);
            var x = ''
            for (i in chain) {
                if(i == 0) {
                    x = chain[i];
                }
                else {
                    x = x+'+'+chain[i];
                }
            }
            x = '|' + x;
            x = $('#L3Dst').val() + '+' +
                $('#L3Src').val() + '+' +
                $('#ProtoSelector').val() + '+' +
                $('#L4Dst').val() + '+' +
                $('#L4Src').val() + '+' +
                $('#DeviceSelector').val() + '+' + x;
            // alert("This is where function works. \n" + json);
            console.log(x)
            $.post('compile', {'data':x});
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
            alert(s);
        }
    });

    var start = undefined;
    for(i in components) {
        start = components[i].type;
        for (j in connections) {
            if(connections[j].target.type == start) {
                start = undefined;
                break;
            }
        }
    }
    if(typeof(start) == 'undefined') {
        alert('Start is undefined!');
        return undefined;
    }

    var chain = []

    for (i in components) {
        chain.push(start);
        console.log(start);
        for (j in connections) {
            if(connections[j].source.type == start) {
                start = connections[j].target.type;
                break;
            }
        }
    }
    return chain;

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
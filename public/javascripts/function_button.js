$(function() {
    // $('body').css('min-height', '0px');
    $('#FunctionButton').click(function() {
        var writer = new draw2d.io.json.Writer();
        writer.marshal(app.view, function(json){
            // json is description data of the canvas, consisting of topo structure and other info
            var code = 'code generated'; // toCode(simplifyJSON(app.view, json));
            console.log(code);
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
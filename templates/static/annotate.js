// node_id = '1_1'
// load_image(node_id)
// elements = get_extra_bits(tour.json, node_id) // ["<a-entity text="value: THIS IS A TEST; width: 3"></a-entity>"] 

$.getJSON( "static/tour.json", function( json ) {
    console.log( "all", json);
    let nodeId = "1_1";
    let annotations = json.annotations[nodeId];
    console.log(annotations);
    let scene = document.getElementById("scene");

    for (var a = 0; a < annotations.length; a++) {
        let annotation = document.createElement("a-text");
        annotation.setAttribute("value", annotations[a].value);
        annotation.setAttribute("color", annotations[a].color);
        annotation.setAttribute("z-offset", annotations[a].zoffset)
        annotation.setAttribute("width", annotations[a].width);
        annotation.setAttribute("height", annotations[a].height)
        scene.appendChild(annotation);
        annotation = undefined;
    }

});

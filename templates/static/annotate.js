// node_id = '1_1'
// load_image(node_id)
// elements = get_extra_bits(tour.json, node_id) // ["<a-entity text="value: THIS IS A TEST; width: 3"></a-entity>"] 

$.getJSON( "static/tour.json", function( json ) {
    console.log( "all", json);
    let nodeId = "1_1";
    let annotations = json.annotations[nodeId];
    console.log(annotations);

    let annotation = document.createElement("a-entity");
    annotation.setAttribute("text", "value: " + annotations[0].value);
    // annotation.setAttribute("width", annotations[0].width);
    // annotation.setAttribute("height", annotations[0].height)


    let scene = document.getElementById("scene");
    scene.appendChild(annotation);
});

// function getAnnotations(json, nodeId) {
//     let a = json[nodeId];
//     console.log("node", a);
// }
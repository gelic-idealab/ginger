
function renderAnnontations(annotations, nodeId) {
    let local = annotations[nodeId];
    console.log(local);

    for (var a = 0; a < local.length; a++) {
        let annotation = document.createElement("a-text");
        annotation.setAttribute("value", local[a].value);
        annotation.setAttribute("color", local[a].color);
        annotation.setAttribute("z-offset", local[a].zoffset)
        annotation.setAttribute("width", local[a].width);
        annotation.setAttribute("height", local[a].height)
        scene.appendChild(annotation);
        annotation = undefined;
    }
};

var scene = document.getElementById("scene");

let annotations = config.annotations;
renderAnnontations(annotations, "1_1");

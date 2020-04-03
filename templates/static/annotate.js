
var scene = document.getElementById("scene");
var annotations = config.annotations;
var orientations = config.orientations;
function renderAnnontations(nodeId) {
    $(".annotation").remove();
    let local = annotations[nodeId];
    if (local) {
        for (var a = 0; a < local.length; a++) {
            if (local[a].type == "text") {
                let annotation = document.createElement("a-text");
                annotation.setAttribute("value", local[a].value);
                annotation.setAttribute("color", local[a].color);
                annotation.setAttribute("z-offset", local[a].zoffset)
                annotation.setAttribute("width", local[a].width);
                annotation.setAttribute("height", local[a].height)
                annotation.setAttribute("class", "annotation");
                scene.appendChild(annotation);
                annotation = undefined;
            }
            if (local[a].type == "highlight") {
                let annotation = document.createElement("a-entity");
                annotation.setAttribute("geometry", local[a].geometry);
                annotation.setAttribute("z-offset", local[a].zoffset)
                annotation.setAttribute("class", "annotation");
                scene.appendChild(annotation);
                annotation = undefined;
            }
        }
    };
};

function applyOrientation(nodeId) {
    let local = orientations[nodeId]
    let current = document.getElementById("image-current");
    if (local) {
        console.log("appplying custom orientation to:", nodeId, local.rotation)
        current.setAttribute("rotation", local.rotation)
    } else {
        current.setAttribute("rotation", "0 0 0")
    }
}



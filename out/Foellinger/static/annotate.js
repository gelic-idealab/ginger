
var scene = document.getElementById("scene");
// var annotations = config.annotations;
// var orientations = config.orientations;
function renderAnnontations(nodeId) {
    $(".annotation").remove();
    let node = config[nodeId];
    if (node) {
        let local = config[nodeId].annotations;
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
                if (local[a].type == "geometry") {
                    let annotation = document.createElement("a-plane");
                    annotation.setAttribute("width", local[a].width);
                    annotation.setAttribute("height", local[a].height);
                    annotation.setAttribute("position", local[a].position);
                    annotation.setAttribute("rotation", local[a].rotation);
                    annotation.setAttribute("material", local[a].material);
                    annotation.setAttribute("class", "annotation");
                    scene.appendChild(annotation);
                    annotation = undefined;
                }
            }
        }
    };
};

function applyOrientation(nodeId) {
    let node = config[nodeId];
    let current = document.getElementById("image-current");
    if (node) {
        let local = config[nodeId].orientations
        if (local) {
            console.log("appplying custom orientation to:", nodeId, local.rotation)
            current.setAttribute("rotation", local.rotation)
        } else {
            current.setAttribute("rotation", "0 0 0")
        }
    } else {
        current.setAttribute("rotation", "0 0 0")
    }
}



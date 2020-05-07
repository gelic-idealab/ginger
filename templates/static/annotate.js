
var scene = document.getElementById("scene");

function renderAnnontations(nodeId) {
    $(".annotation").remove();
    let node = config[nodeId];
    if (node) {
        let local = config[nodeId].annotations;
        if (local) {
            for (var a = 0; a < local.length; a++) {
                if (local[a].type) {
                    let annotation = 0;
                    if (local[a].type == 'text') {
                        annotation = document.createElement("a-text");
                    }
                    if (local[a].type == 'geometry') {
                        annotation = document.createElement("a-plane");

                        // annotation.setAttribute("width", local[a].width);
                        // annotation.setAttribute("height", local[a].height);
                        // annotation.setAttribute("position", local[a].position);
                        // annotation.setAttribute("rotation", local[a].rotation);
                        // annotation.setAttribute("material", local[a].material);
                    }
                    for (att of Object.keys(local[a])) {
                        console.log(att, local[a][att])
                        annotation.setAttribute(att, local[a][att])
                    }
                    if (annotation) {
                        annotation.setAttribute("class", "annotation");
                        scene.appendChild(annotation);
                        annotation = undefined;
                    }

                }
            }
        }
    };
};

function applyOrientation(nodeId) {
    let node = config[nodeId];
    let current = document.getElementById("image-current");
    if (node) {
        let local = config[nodeId].rotation;
        if (local) {
            console.log("appplying custom orientation to:", nodeId, local)
            current.setAttribute("rotation", local)
        } else {
            current.setAttribute("rotation", "0 0 0")
        }
    } else {
        current.setAttribute("rotation", "0 0 0")
    }
}



var scene = document.getElementById("scene");

function loadConfig() {
    let oldConfig = document.getElementById('config')
    if (oldConfig != null) {
        oldConfig.parentNode.removeChild(oldConfig)
    }
    let newConfig = document.createElement("script")
    newConfig.setAttribute("src", "static/config.js")
    newConfig.setAttribute("type", "text/javascript")
    newConfig.setAttribute("id", "config")
    document.body.appendChild(newConfig)
}

loadConfig()

window.addEventListener('message', function (msg) {
    console.log('tour received message:', msg.data)
    if (msg.data == 'reloadConfig') {
        console.log('config reload requested')
        loadConfig()
        renderAnnontations(current.here)
    }
  })

function renderAnnontations(nodeId) {
    $(".annotation").remove();
    let node = config[nodeId];
    if (node) {
        let local = config[nodeId].annotations;
        if (local) {
            for (var a = 0; a < local.length; a++) {
                if (local[a].type) {
                    let annotation = null;
                    if (local[a].type == 'text') {
                        annotation = document.createElement("a-text");
                    }
                    if (local[a].type == 'area') {
                        annotation = document.createElement("a-"+local[a].primitive);
                    }
                    for (att of Object.keys(local[a])) {
                        // console.log(att, local[a][att])
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

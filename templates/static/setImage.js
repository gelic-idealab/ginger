AFRAME.registerComponent('set-image', {
      schema: {
        on: {type: 'string'},
        target: {type: 'selector'},
        src: {type: 'string'},
        dur: {type: 'number', default: 500}
      },
      init: function () {
        var data = this.data;
        var el = this.el;

        if(current.right == null)document.querySelector('#goRightLink').setAttribute("visible", false);
        else document.getElementById('goRightLink').setAttribute("visible", true);
        if(current.left == null) document.getElementById('goLeftLink').setAttribute("visible", false);
        else document.getElementById('goLeftLink').setAttribute("visible", true);
        if(current.forward == null) document.getElementById('goForwardLink').setAttribute("visible", false);
        else document.getElementById('goForwardLink').setAttribute("visible", true);
        if(current.backward == null) document.getElementById('goBackwardLink').setAttribute("visible", false);
        else document.getElementById('goBackwardLink').setAttribute("visible", true);


        el.addEventListener(data.on, function () {
            if(current[data.src.split('-')[1]] != null) {
                // Fade out image.
                data.target.emit('fade');
                console.log(data);
                console.log(el);
                console.log(current);
                // Wait for fade to complete.
                setTimeout(function () {
                    // Set image.
                    data.target.setAttribute('material', 'src', "#"+current[data.src.split('-')[1]]);
                    var previous = current;
                    current = listOfFiles[current[data.src.split('-')[1]]];
                    if(current.right == null)document.querySelector('#goRightLink').setAttribute("visible", false);
                    else document.getElementById('goRightLink').setAttribute("visible", true);
                    if(current.left == null) document.getElementById('goLeftLink').setAttribute("visible", false);
                    else document.getElementById('goLeftLink').setAttribute("visible", true);
                    if(current.forward == null) document.getElementById('goForwardLink').setAttribute("visible", false);
                    else document.getElementById('goForwardLink').setAttribute("visible", true);
                    if(current.backward == null) document.getElementById('goBackwardLink').setAttribute("visible", false);
                    else document.getElementById('goBackwardLink').setAttribute("visible", true);

                }, data.dur);
            }
        });
      }
    });


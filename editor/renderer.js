// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const {BrowserWindow} = require('electron').remote
const path = require('path')
const fs = require('fs')

const package = document.getElementById('packageLoader')

var indexPath;
var configPath;

package.addEventListener('change', (event) => {

  for(var i = 0; i < package.files.length; i++) {
    if (package.files[i].name === "index.html") {
      indexPath = package.files[i].path;
    }
    if (package.files[i].name === "config.js") {
      configPath = package.files[i].path;
    }
  }

  console.log('loading tour:', indexPath, configPath);
  var configData = require(configPath);

  // setting up iframe embedding of tour
  let parent = document.getElementById('frame');
  let oldFrame = document.getElementById('iframe');
  if (oldFrame != null) {
    parent.removeChild(oldFrame);
  }
  let frame = document.createElement('iframe');
  frame.setAttribute('id', 'iframe')
  frame.setAttribute('src', indexPath)
  frame.setAttribute('width', 1024);
  frame.setAttribute('height', 768);
  parent.appendChild(frame);


  // setting up config rending in editor
  let sceneGraph = document.getElementById('sceneGraph');
  let oldGraph = document.getElementById('graph')
  if (oldGraph != null) {
    console.log('removing old sceneGraph')
    sceneGraph.removeChild(oldGraph);
  }
  let graph = document.createElement('div');
  graph.setAttribute('id', 'graph');
  sceneGraph.appendChild(graph);


  // render properties for selected node
  function renderNodeConfig(key, skey, i) {
      currentConfigElement = { 'key': key, 'skey': skey, 'i': i };
      let config = document.getElementById('config');
      config.removeChild(document.getElementById('keys'));
      let newKeys = document.createElement('p');
      newKeys.setAttribute('id', 'keys');
      let form = document.createElement('form');
      form.setAttribute('name', 'props')
      for (let k of Object.keys(configData[key][skey][i])) {
        // console.log('renderNodeConfig fired:', key, skey, i, k, configData[key][skey][i][k])
        let currentValue = configData[key][skey][i][k];
        let input = document.createElement('input');
        input.setAttribute('value', currentValue);
        input.setAttribute('type', "text");
        if (k == 'type') {
          input.disabled = true;
        };
        
        input.setAttribute('id', k);
        input.addEventListener('change', (event) => { 
          edited = true; 
          intermediateConfig[k] = document.getElementById(k).value; 
          console.log('config edited:', k, document.getElementById(k).value); 
        });

        let label = document.createElement('label')
        label.setAttribute('for', k)
        label.insertAdjacentText('afterbegin', k)

        form.appendChild(input);
        form.appendChild(label);
      }
      newKeys.appendChild(form);
      config.appendChild(newKeys);
  }

  // render scene graph
  for (let key in configData) {
    let ptag = document.createElement('p');
    ptag.setAttribute('id', key)
    ptag.insertAdjacentText('afterbegin', key);
    for (let skey of Object.keys(configData[key])) {
      let ptag2 = document.createElement('p');
      ptag2.insertAdjacentText('afterbegin', skey)
      for (let i in configData[key][skey]) {
        let ptag3 = document.createElement('a');
        ptag3.setAttribute('class', "waves-effect waves-light btn");
        ptag3.insertAdjacentText('afterbegin', i);
        ptag3.onclick = function(){ renderNodeConfig(key, skey, i) };
        ptag2.appendChild(ptag3);
      }
      ptag.appendChild(ptag2);
    }
    graph.appendChild(ptag);
  }

});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});
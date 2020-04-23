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
var configData;

var nodeMap = { current: "", previous: ""};


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
  configData = require(configPath);

  // setting up iframe embedding of tour
  let parent = document.getElementById('frame');
  let oldFrame = document.getElementById('iframe');
  if (oldFrame != null) {
    parent.removeChild(oldFrame);
  }
  let frame = document.createElement('iframe');
  frame.setAttribute('id', 'iframe')
  frame.setAttribute('src', indexPath)
  frame.setAttribute('style', "position: relative; height: 100%; width: 100%;")
  frame.setAttribute('scrolling', 'no');
  frame.setAttribute('frameborder', '0');
  parent.appendChild(frame);


  // setting up config rending in editor
  let sceneGraph = document.getElementById('sceneGraph');
  let oldGraph = document.getElementById('graph')
  if (oldGraph != null) {
    console.log('removing old sceneGraph')
    sceneGraph.removeChild(oldGraph);
  }
  var graph = document.createElement('div');
  graph.setAttribute('id', 'graph');
  sceneGraph.appendChild(graph);

  renderSceneGraph(configData);

  // highlight starting node in scene graph
  let nodeChangeEvent = new CustomEvent('nodeChange', {detail: {here: configData.start.node}})
  document.dispatchEvent(nodeChangeEvent);

  // reset properties panel
  let config = document.getElementById('config');
  config.removeChild(document.getElementById('keys'));
  let newKeys = document.createElement('p');
  newKeys.setAttribute('id', 'keys');
  config.appendChild(newKeys);

});

// render function for properties of selected annotation
function renderNodeConfig(key, skey, i) {
  let config = document.getElementById('config');
  config.removeChild(document.getElementById('keys'));
  let newKeys = document.createElement('p');
  newKeys.setAttribute('id', 'keys');
  let form = document.createElement('form');
  form.setAttribute('name', 'props')

  if (key == 'start') {
    currentConfigElement = { 'key': key }
    props = configData[key];

    for (let k of Object.keys(props)) {
      let inputField = document.createElement('div');
      inputField.setAttribute('class', 'input-field');
      let currentValue = props[k];
      let input = document.createElement('input');
      input.setAttribute('type', "text");

      input.setAttribute('value', currentValue);
      input.setAttribute('id', k);
      input.addEventListener('change', (event) => { 
        edited = true; 
        intermediateConfig[k] = document.getElementById(k).value; 
        console.log('config edited:', k, document.getElementById(k).value); 
      });
      inputField.appendChild(input);

      let label = document.createElement('label')
      label.setAttribute('for', k)
      label.setAttribute('class', 'active');
      label.insertAdjacentText('afterbegin', k)
      inputField.appendChild(label);

      form.appendChild(inputField);
    }
  }

  // render annotations
  if (skey == 'annotations') {
    // if annotation does not exist, create one with default values
    if (i == 'newText') {
      currentConfigElement = { 'key': key, 'skey': skey, 'i': 'new' };
      let newText = {
        "type": "text",
        "value": "",
        "width": 10,
        "height": 10,
        "color": "black",
        "xoffset": 0,
        "yoffset": 0,
        "zoffset": -5
      }
      props = newText;
      intermediateConfig = newText;
      edited = true;

    } else {
      currentConfigElement = { 'key': key, 'skey': skey, 'i': i };
      props = configData[key][skey][i];
    }

    // iterate property keys and render
    for (let k of Object.keys(props)) {
      // console.log('renderNodeConfig fired:', key, skey, i, k, props[k])
      let inputField = document.createElement('div');
      inputField.setAttribute('class', 'input-field');
      let currentValue = props[k];
      let input = document.createElement('input');
      if (k == 'color') {
        input.setAttribute('type', 'color');
        input.setAttribute('style', 'width:100%');
      } else {
        input.setAttribute('type', "text");
      }
      if (k == 'type') {
        input.disabled = true;
      };

      input.setAttribute('value', currentValue);
      input.setAttribute('id', k);
      input.addEventListener('change', (event) => { 
        edited = true; 
        intermediateConfig[k] = document.getElementById(k).value; 
        console.log('config edited:', k, document.getElementById(k).value); 
      });
      inputField.appendChild(input);

      let label = document.createElement('label')
      label.setAttribute('for', k)
      label.setAttribute('class', 'active');
      label.insertAdjacentText('afterbegin', k)
      inputField.appendChild(label);

      form.appendChild(inputField);
    }
  };

  // render rotation properties
  if (skey == 'rotation') {
    currentConfigElement = { 'key': key, 'skey': skey };
    let inputField = document.createElement('div');
    inputField.setAttribute('class', 'input-field');
    let input = document.createElement('input');
    input.setAttribute('type', "text");

    let currentValue = configData[key][skey];
    if (currentValue == undefined) {
      currentValue = "0 0 0"
    }
    input.setAttribute('value', currentValue);
    input.setAttribute('id', skey);
    input.addEventListener('change', (event) => { 
      edited = true; 
      intermediateConfig[skey] = document.getElementById(skey).value; 
      console.log('config edited:', skey, document.getElementById(skey).value); 
    });
    inputField.appendChild(input);
    form.appendChild(inputField);
  };

  newKeys.appendChild(form);
  config.appendChild(newKeys);
}

function renderSceneGraph(configData) {
  // render scene graph
  for (let key in configData) {
    let ptag = document.createElement('div');
    ptag.setAttribute('class', 'section');
    ptag.setAttribute('id', key)
    if (key != 'start') {
      ptag.insertAdjacentText('afterbegin', key + ": ");

      let addBtn = document.createElement('a');
      addBtn.setAttribute('class', "waves-effect waves-light btn-small");
      addBtn.onclick = function() { renderNodeConfig(key, 'annotations', 'newText')}
      let addIcon = document.createElement('i');
      addIcon.setAttribute('class', "material-icons small");
      addIcon.insertAdjacentText('afterbegin', 'add_box');
      addBtn.appendChild(addIcon);
      ptag.appendChild(addBtn);
      
      // edit rotation button
      let editRot = document.createElement('a');
      editRot.setAttribute('class', "waves-effect waves-light btn-small");
      editRot.onclick = function(){ renderNodeConfig(key, 'rotation') };
      let rotIcon = document.createElement('i');
      rotIcon.setAttribute('class', "material-icons small");
      rotIcon.insertAdjacentText('afterbegin', 'rotate_right');
      editRot.appendChild(rotIcon);
      ptag.appendChild(editRot);
      graph.appendChild(ptag);

      for (let skey of Object.keys(configData[key])) {
        let ptag2 = document.createElement('p');
        // ptag2.insertAdjacentText('afterbegin', skey)
        if (skey == 'annotations') {
          for (let i in configData[key][skey]) {
            let ptag3 = document.createElement('p');
            ptag3.setAttribute('class', "waves-effect waves-light btn-small");
            ptag3.insertAdjacentText('afterbegin', configData[key][skey][i].value || i);
            ptag3.onclick = function(){ renderNodeConfig(key, skey, i) };
            ptag2.appendChild(ptag3);
          }
          ptag.appendChild(ptag2);
        }
      }
  

    } else {
      let editStart = document.createElement('a');
      editStart.setAttribute('class', "waves-effect waves-light btn");
      editStart.onclick = function(){ renderNodeConfig('start') };
      // editStart.insertAdjacentText('afterbegin', 'Edit starting place')
      let startIcon = document.createElement('i');
      startIcon.setAttribute('class', "material-icons");
      startIcon.insertAdjacentText('afterbegin', 'add_location');
      editStart.appendChild(startIcon);
      ptag.appendChild(editStart);
      ptag.setAttribute('style', 'text-align:center')

    }
    graph.appendChild(ptag);
  }
};


window.document.addEventListener('nodeChange', handleEvent, false)
function handleEvent(e) {
  console.log('a-frame event, nodeChange:', e.detail)
  nodeMap.previous = nodeMap.current;
  nodeMap.current = e.detail.here;
  let currentNode = document.getElementById(nodeMap.current);
  currentNode.setAttribute('style', "color:red");
  let previousNode = document.getElementById(nodeMap.previous);
  if (previousNode != null) {
    previousNode.removeAttribute('style');
  }
}

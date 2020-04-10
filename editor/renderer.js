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

package.addEventListener('change', (event) => {

  for(var i = 0; i < package.files.length; i++) {
    if (package.files[i].name === "index.html") {
      var indexPath = package.files[i].path;
    }
    if (package.files[i].name === "config.js") {
      var configPath = package.files[i].path;
    }
  }

  console.log(indexPath, configPath);

  // setting up iframe embedding of tour
  let parent = document.getElementById('frame');
  let frame = document.createElement('iframe');
  frame.setAttribute('src', indexPath)
  frame.setAttribute('width', 800);
  frame.setAttribute('height', 600);
  parent.appendChild(frame);


  // setting up config rending in editor
  let graph = document.getElementById('graph');
  let config = document.getElementById('config')
  let ptag = document.createElement('p')

  let configData = require(configPath);
  console.log(configData);

  function renderNodeConfig(key, skey) {
      let config = document.getElementById('config');
      config.removeChild(document.getElementById('keys'));
      let newKeys = document.createElement('p');
      newKeys.setAttribute('id', 'keys');
      for(let i in configData[key][skey]) {
        let newPtag = document.createElement('p');
        console.log('renderNOdeConfig fired:', key, skey)
        newPtag.insertAdjacentText('afterbegin', Object.keys(configData[key][skey][i]));
        newKeys.appendChild(newPtag);
      }
      config.appendChild(newKeys)
  }

  for (let key in configData) {
    let ptag = document.createElement('p');
    ptag.insertAdjacentText('afterbegin', key);
    for (let skey of Object.keys(configData[key])) {
      let ptag2 = document.createElement('p');
      ptag2.insertAdjacentText('afterbegin', skey)
      ptag2.onclick = function(){renderNodeConfig(key, skey)};
      ptag.appendChild(ptag2);
    }
    graph.appendChild(ptag);

  }

  // ptag.insertAdjacentText('afterbegin', JSON.stringify(configData))
  // config.appendChild(ptag);


});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});
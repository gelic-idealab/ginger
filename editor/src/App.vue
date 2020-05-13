<template>
  <div>

    <nav class="">
      <div class="nav-wrapper">
        <ul class="left">

          <li>
            <a class="file-field input-field waves-effect waves-light btn"><i class="material-icons small">folder_open</i>
                <input type="file" id="packageLoader" name="packageDir" webkitdirectory="true" @change="loadTourPackage($event)">
            </a>
          </li>
          <li>
            <a class="waves-effect waves-light btn"><i class="material-icons">undo</i></a>
          </li>
          <li>
            <a class="waves-effect waves-light btn"><i class="material-icons">redo</i></a>
          </li>

        </ul>
      </div>
    </nav>

    <!-- Page Layout here -->
    
    <div style="height: 90vh;">
      <div class="row" style="height: 100%;">

        <div class="col s2" style="height: 100%; overflow-y:auto;">
          <h5 style="text-align: center;">Scene</h5>
          <div class="" id="sceneGraph">
            <ul class="collapsible" data-collapsible="accordion">
              <li v-for="key in Object.keys(configData)" :key="key">
                <div class="collapsible-header grey lighten-3">
                  <span>{{ key }}</span>
                  <span v-if="configData[key]['annotations']" class="new badge" data-badge-caption="annotations">{{ configData[key]['annotations'].length }}</span>
                </div>
                  <div class="collapsible-body">
                    <div v-for="key2 in Object.keys(configData[key])" :key="key2">
                      <span>{{ key2 }}</span>
                      <div class="collection" v-if="key2=='annotations' && configData[key][key2].length > 0">
                        <a href="#!" class="collection-item truncate" 
                        v-for="(i,index) in configData[key][key2]" 
                        :key="index+i.value" 
                        :class="isActive(key, key2, index)" 
                        v-on:click="makeActive(key, key2, index)"
                        >
                          {{ i.label || index }}
                        </a>
                      </div>
                      <div style="margin:10px" class="center-align" v-if="key2=='annotations'">
                        <a style="margin:3px" class="waves-effect waves-light btn-small" @click="addTextAnnotation(key)">Text<i class="material-icons right">text_format</i></a>
                        <a style="margin:3px" class="waves-effect waves-light btn-small" @click="addAreaAnnotation(key)">Area<i class="material-icons right">crop_din</i></a>
                      </div>
                      <div class="collection" v-else-if="key2=='rotation' || key2=='cameraRotation' || key2=='node'">
                        <a href="#!" class="collection-item"
                        :class="isActive(key, key2)" 
                        v-on:click="makeActive(key, key2)"
                        >
                        {{ configData[key][key2] }}</a>
                      </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
        </div>

        <div class="col s8" style="height: 100%;">
          <div style="height: 100%;">
            <iframe id="iframe" allow="fullscreen" :src="indexPath" style="position: relative; height: 100%; width: 100%;" frameborder="0" scrolling="no"></iframe>
          </div>
        </div>

        <div class="col s2" style="height: 100%; overflow-y:auto;">
          <h5 style="text-align: center;">Properties</h5>
          <div id="properties" class="card-panel grey lighten-3">
            <div id="keys">
              <form v-if="activelyEditing.index != null">
                <div class="row" v-for="(val, key) in activelyEditing.value" :key="key">
                  <div class="input-field">
                    <input v-model="activelyEditing.value[key]" :id="key" type="text" @change="saveConfig">
                    <label class="active" :for="key">{{ key }}</label>
                  </div>
                </div>
              </form>
              <form v-if="activelyEditing.index == null">
                <div class="row">
                  <div class="input-field">
                    <input v-model="activelyEditing.value" :id="activelyEditing.key2" type="text" @change="saveConfig">
                    <label class="active" :for="activelyEditing.key2">{{ activelyEditing.key2 }}</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="center-align">
              <button v-if="activelyEditing.key2=='annotations'" 
                id="deleteBtn" 
                class="waves-effect waves-light btn-small red" 
                @click="deleteAnnotation(activelyEditing.key, activelyEditing.index)">Delete</button>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import M from 'materialize-css'
const path = require('path')
const fs = require('fs')


export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      indexPath: '',
      configPath: '',
      configData: {},
      activelyEditing: {
        key: '',
        key2: '',
        index: null,
        value: null
      }
    }
  },
  mounted: function() {
    M.AutoInit()

    window.addEventListener('message', function (msg) {
      console.log('received message from iframe:', msg.data)
    })
  },
  methods: {
    loadTourPackage(e) {
      let files = e.target.files;
      console.log(files)
      this.indexPath = path.join(files[0].path, 'index.html');
      this.configPath = path.join(files[0].path, 'static', 'config.js');
      console.log('loading tour:', this.indexPath, this.configPath);
      fs.readFile(this.configPath, 'utf8', (err, data) => {
        if (err) {
          console.log(err)
        } else {
          data = data.split('=')[1]
          this.configData = JSON.parse(data)
        }
      });
    },

    isActive(key, key2, index=null) {
      if (this.activelyEditing.key == key && this.activelyEditing.key2 == key2 && this.activelyEditing.index == index) {
        return "active"
      } else {
        return ""
      }
    },

    makeActive(key, key2, index=null) {
      this.activelyEditing.key = key;
      this.activelyEditing.key2 = key2;
      this.activelyEditing.index = index;
      if (key && key2) {
        if (index != null) {
          this.activelyEditing.value = this.configData[key][key2][index]
        } else {
          this.activelyEditing.value = this.configData[key][key2]
        }
      } else {
        this.activelyEditing.value = null
      }
    },

    saveConfig() {
      console.log('saving...')
      if (this.activelyEditing.key && this.activelyEditing.key2) {
        if (this.activelyEditing.index != null) {
          this.configData[this.activelyEditing.key][this.activelyEditing.key2][this.activelyEditing.index] = this.activelyEditing.value
        } else {
          this.configData[this.activelyEditing.key][this.activelyEditing.key2] = this.activelyEditing.value
        }
      }
      let configText = "var config = "
      configText += JSON.stringify(this.configData)
      fs.writeFile(this.configPath, configText, (err) => {
        if (err) {
          console.log(err)
        } else {
          let iframe = document.getElementById('iframe')
          iframe.contentWindow.postMessage('reloadConfig', '*')
        }
      })
    },

    addTextAnnotation(key) {

    // A-frame text API
    // Property       Description                                           Default Value
    // align          Multi-line text alignment (left, center, right).	    left
    // alphaTest	    Discard text pixels if alpha is less than this value.	0.5
    // anchor	        Horizontal positioning (left, center, right, align).	center
    // baseline	      Vertical positioning (top, center, bottom).	          center
    // color	        Text color.	                                          white
    // font	          Font to render text, either the name of one of 
    //                A-Frame’s stock fonts or a URL to a font file	        default
    // fontImage	    Font image texture path to render text. Defaults 
    //                to the font‘s name with extension replaced to .png. 
    //                Don’t need to specify if using a stock font.	        derived from font name
    // height	        Height of text block.	                                derived from text size
    // letterSpacing	Letter spacing in pixels.	                            0
    // lineHeight	    Line height in pixels.	                              derived from font file
    // opacity	      Opacity, on a scale from 0 to 1, where 0 means fully 
    //                transparent and 1 means fully opaque.	                1.0
    // shader	        Shader used to render text.	                          sdf
    // side	          Side to render. (front, back, double)	                front
    // tabSize	      Tab size in spaces.	                                  4
    // transparent	  Whether text is transparent.	                        true
    // value	        The actual content of the text. Line breaks and 
    //                tabs are supported with \n and \t.	                  ‘’
    // whiteSpace	    How whitespace should be handled (i.e., normal, 
    //                pre, nowrap). Read more about whitespace.	            normal
    // width	        Width in meters.	                                    derived from geometry if exists
    // wrapCount	    Number of characters before wrapping text.	          40
    // wrapPixels	    Number of pixels before wrapping text.	              derived from wrapCount
    // xOffset	      X-offset to apply to add padding.                     0 
    // zOffset	      Z-offset to apply to avoid Z-fighting if using 
    //                with a geometry as a background.	                    0.001

      let newTextAnnotation = {
        "label": "",
        "type": "text",
        "position": "0 0 -5",
        "rotation": "0 0 0",
        "align": "",
        "color": "white",
        // "font":	"default",
        "height":	10,
        "letter-spacing": 0,
        "opacity": 1.0,
        // "shader":	"sdf",
        "side": "double",
        "transparent":	"false",
        "value": "",
        "width": "10",
        "wrap-count": "40",
      }
      let length = this.configData[key]['annotations'].push(newTextAnnotation)
      this.makeActive(key, 'annotations', length-1)
    },

    addAreaAnnotation(key) {
      let newAreaAnnotation = {
        "label": "",
        "type": "area",
        "primitive": "plane",
        "position": "0 0 -5",
        "rotation": "-90 0 0",
        "color": "#FFF",
        "height": "1",
        "width": "1"
      }
      let length = this.configData[key]['annotations'].push(newAreaAnnotation)
      this.makeActive(key, 'annotations', length-1)
    },

    deleteAnnotation(key, index) {
      this.configData[key]['annotations'].splice(index, 1)
      this.makeActive(null, null, null)
      this.saveConfig()
    }
  }
}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>

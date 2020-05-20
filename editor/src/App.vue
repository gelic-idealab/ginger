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
          <!-- <li>
            <a class="waves-effect waves-light btn"><i class="material-icons">undo</i></a>
          </li>
          <li>
            <a class="waves-effect waves-light btn"><i class="material-icons">redo</i></a>
          </li> -->
        </ul>
        <div class="brand-logo center">{{ currentTourPath }}</div>
        <div class="right" style="margin-right:15px">
          <code>v0.1.5</code>
        </div>
      </div>
    </nav>

    <!-- Page Layout here -->
    
    <div style="height: 90vh;">
      <div class="row" style="height: 100%;">

        <div class="col s2" style="height: 100%; overflow-y:auto;">
          <h5 style="text-align: center;">Scene</h5>
          <div class="card-panel grey lighten-3" v-if="Object.keys(configData).length == 0">
            <span style="align:center">No scene loaded</span>
          </div>
          <div class="" id="sceneGraph" v-show="Object.keys(configData).length">
            <ul class="collapsible" data-collapsible="accordion">
              <li v-for="key in Object.keys(configData)" :key="key" >
                <div class="collapsible-header lighten-3" :class="isActiveNode(key)">
                  <span>{{ key }}</span>
                  <span v-if="configData[key]['annotations'] && configData[key]['annotations'].length" class="new badge" data-badge-caption="annotations">{{ configData[key]['annotations'].length }}</span>
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
                        <a style="margin:3px" class="waves-effect waves-light btn-small" @click="addPlaneAnnotation(key)">Plane<i class="material-icons right">crop_square</i></a>
                        <a style="margin:3px" class="waves-effect waves-light btn-small" @click="addBoxAnnotation(key)">Box<i class="material-icons right">gradient</i></a>
                        <a style="margin:3px" class="waves-effect waves-light btn-small" @click="addCircleAnnotation(key)">Circle<i class="material-icons right">fiber_manual_record</i></a>
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
            <span style="align:center" v-if="activelyEditing.value == null">Select annotation to edit</span>
            <div id="keys" v-if="activelyEditing.value">
              <form v-if="activelyEditing.index != null">
                <div class="row" v-for="(val, key) in activelyEditing.value" :key="key">
                  <div class="input-field">

                    <!-- disable changing annotation type -->
                    <input v-if="key=='type'" v-model="activelyEditing.value[key]" :id="key" type="text" @change="saveConfig" disabled>

                    <!-- render select field for text alignment -->
                    <select class="browser-default" v-else-if="key=='align'" :id="key" v-model="activelyEditing.value[key]" @change="saveConfig">
                      <option value="" disabled selected>Choose alignment</option>
                      <option value="left">left</option>
                      <option value="center">center</option>
                      <option value="right">right</option>
                    </select>

                    <!-- render select field for stock font types -->
                    <select class="browser-default" v-else-if="key=='font'" :id="key" v-model="activelyEditing.value[key]" @change="saveConfig">
                      <option value="" disabled selected>Choose font</option>
                      <option v-for="font in supportedFonts" :value="font" :key="font">{{ font }}</option>
                    </select>

                    <!-- render select field for geometric primitives -->
                    <select class="browser-default" v-else-if="key=='primitive'" :id="key" v-model="activelyEditing.value[key]" @change="saveConfig" disabled>
                      <option value="" disabled selected>Choose geometric primitive</option>
                      <option v-for="primitive in supportedPrimitives" :value="primitive" :key="primitive">{{ primitive }}</option>
                    </select>

                    <!-- render text fields for everything else -->
                    <input v-else v-model="activelyEditing.value[key]" :id="key" type="text" @change="saveConfig">


                    <label class="active" :for="key">{{ key }}</label>
                  </div>
                </div>
              </form>

              <!-- render form differently if editing start or orientation objects -->
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
      currentTourPath: 'Load a tour package...',
      activelyEditing: {
        key: '',
        key2: '',
        index: null,
        value: null
      },
      supportedFonts: ['roboto', 'aileronsemibold', 'dejavu', 'exo2bold', 'exo2semibold', 'kelsonsans', 'monoid', 'mozillavr', 'sourcecodepro'],
      // see https://aframe.io/docs/1.0.0/components/text.html#stock-fonts
      supportedPrimitives: ['box', 'circle', 'cone', 'cylinder', 'dodecahedron', 'octahedron', 'plane', 'ring', 'sphere', 'tetrahedron', 'torus', 'triangle'],
      activeNode: ""
    }
  },
  mounted: function() {
    M.AutoInit()

    window.addEventListener('message', this.makeActiveNode);
  },
  methods: {
    loadTourPackage(e) {
      let files = e.target.files;
      console.log(files)
      this.currentTourPath = files[0].path;
      this.indexPath = path.join(files[0].path, 'index.html');
      this.configPath = path.join(files[0].path, 'static', 'config.js');
      console.log('loading tour:', this.indexPath, this.configPath);
      fs.readFile(this.configPath, 'utf8', (err, data) => {
        if (err) {
          console.log(err)
        } else {
          data = data.split('=')[1]
          let parsed = JSON.parse(data)
          this.configData = parsed
          this.activeNode = parsed.start.node
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

    isActiveNode(key) {
      if (key == this.activeNode) {
        return "teal"
      } else {
        return "grey"
      }
    },

    makeActiveNode(msg) {
      if (msg.data.here) {
        console.log('makeActiveNode called:', msg.data)
        this.activeNode = msg.data.here
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
        "align": "left",
        "color": "white",
        "font":	"roboto",
        "height":	10,
        "letter-spacing": 0,
        "opacity": 1.0,
        "side": "double",
        "transparent":	"true",
        "value": "",
        "width": "10",
        "wrap-count": "40",
      }
      let length = this.configData[key]['annotations'].push(newTextAnnotation)
      this.makeActive(key, 'annotations', length-1)
    },

    addPlaneAnnotation(key) {
      let newPlaneAnnotation = {
        "label": "",
        "type": "area",
        "primitive": "plane",
        "position": "0 0 -5",
        "rotation": "-90 0 0",
        "color": "#FFF",
        "height": "1",
        "width": "1",
        "material": "opacity: 1"
      }
      let length = this.configData[key]['annotations'].push(newPlaneAnnotation)
      this.makeActive(key, 'annotations', length-1)
    },
    addBoxAnnotation(key) {
      let newPlaneAnnotation = {
        "label": "",
        "type": "area",
        "primitive": "box",
        "position": "0 0 -5",
        "rotation": "0 0 0",
        "color": "tomato",
        "height": "1",
        "width": "1",
        "depth": "1",
        "material": "opacity: 0.25"
      }
      let length = this.configData[key]['annotations'].push(newPlaneAnnotation)
      this.makeActive(key, 'annotations', length-1)
    },
    addCircleAnnotation(key) {
      let newPlaneAnnotation = {
        "label": "",
        "type": "area",
        "primitive": "circle",
        "position": "0 0 -5",
        "rotation": "-90 0 0",
        "color": "#FFF",
        "radius": "1",
        "material": "opacity: 1"
      }
      let length = this.configData[key]['annotations'].push(newPlaneAnnotation)
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

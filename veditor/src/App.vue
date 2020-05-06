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

        <div class="col s2" style="height: 100%;">
          <h5 style="text-align: center;">Scene</h5>
          <div class="" id="sceneGraph">
            <ul class="collapsible" data-collapsible="accordion">
              <li v-for="key in Object.keys(configData)" :key="key">
                <div class="collapsible-header grey lighten-3"><span>{{ key }}</span></div>
                  <div class="collapsible-body">
                    <div v-for="key2 in Object.keys(configData[key])" :key="key2">
                      <span>{{ key2 }}</span>
                      <div class="collection" v-if="key2=='annotations' && configData[key][key2].length > 0">
                        <a href="#!" class="collection-item" 
                        v-for="(i,index) in configData[key][key2]" 
                        :key="index+i.value" 
                        :class="isActive(key, key2, index)" 
                        v-on:click="makeActive(key, key2, index)"
                        >
                          {{ i.value || index }}
                        </a>
                      </div>
                      <div class="center-align" v-if="key2=='annotations'">
                        <a class="btn-floating waves-effect waves-light btn-small" @click="addAnnotation(key)"><i class="material-icons">add</i></a>
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
          <div id="frame" style="height: 100%;">
            <iframe :src="indexPath" style="position: relative; height: 100%; width: 100%;" frameborder="0" scrolling="no"></iframe>
          </div>
        </div>

        <div class="col s2" style="height: 100%;">
          <h5 style="text-align: center;">Properties</h5>
          <div id="config" class="card-panel blue-grey lighten-3">
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
          data = data.split(';')[0]
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
      }
    },
    saveConfig() {
      if (this.activelyEditing.key && this.activelyEditing.key2) {
        if (this.activelyEditing.index != null) {
          this.configData[this.activelyEditing.key][this.activelyEditing.key2][this.activelyEditing.index] = this.activelyEditing.value
        } else {
          this.configData[this.activelyEditing.key][this.activelyEditing.key2] = this.activelyEditing.value
        }
      }
      let configText = "var config = "
      configText += JSON.stringify(this.configData)
      configText += "; try { module.exports = config; } catch {};"

      fs.writeFile(this.configPath, configText, (err) => { if (err) { console.log(err); } })
    },
    addAnnotation(key) {
      let newAnnotation = {
        "type": "text",
        "value": "",
        "width": 10,
        "height": 10,
        "color": "black",
        "zoffset": -5
      }
      let length = this.configData[key]['annotations'].push(newAnnotation)
      this.makeActive(key, 'annotations', length-1)
    },
    deleteAnnotation(key, index) {
      this.configData[key]['annotations'].splice(index, 1)
      this.makeActive(null, null, null)
      this.saveConfig()
    }
  },
  mounted () {
    M.AutoInit()
},
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

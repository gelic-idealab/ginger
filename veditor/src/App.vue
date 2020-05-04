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
                <div class="collapsible-header"><span>{{ key }}</span></div>
                  <div class="collapsible-body">
                    <div v-for="key2 in Object.keys(configData[key])" :key="key2">
                      <span>{{ key2 }}</span>
                      <div class="collection" v-if="key2=='annotations' && configData[key][key2].length > 0">
                        <a href="#!" class="collection-item" v-for="i in configData[key][key2]" :key="i+i.value">
                          {{ i.value || i }}
                        </a>
                      </div>
                      <div class="collection" v-else-if="key2=='rotation' || key2=='cameraRotation' || key2=='node'">
                        <a href="#!" class="collection-item">{{ configData[key][key2] }}</a>
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
            <div id="keys"></div>
          <a id="saveBtn" class="waves-effect waves-light btn-small" onclick="saveConfig()">Save</a>
          <a id="deleteBtn" class="waves-effect waves-light btn-small red" onclick="deleteConfig()">Delete</a>
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
      configData: {}
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

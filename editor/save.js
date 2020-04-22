var currentConfigElement = {};
var intermediateConfig = {};
var edited = false;

function saveConfig() {
    if (edited) {
        let config = require(configPath);
        // console.log(config)
        let key = currentConfigElement['key'];
        let skey = currentConfigElement['skey'];
        let i = currentConfigElement['i']

        if (skey == 'annotations') {
            if (i == 'new') {
                config[key][skey].push(intermediateConfig);
                console.log('creating new annotation:', intermediateConfig);
            } else {
                for(k of Object.keys(intermediateConfig)) {
                    config[key][skey][i][k] = intermediateConfig[k];
                }
            console.log('updated config:', k, config[key][skey][i][k])
            }

        }

        if (skey == 'rotation') {
            config[key][skey] = intermediateConfig[skey];
            console.log('updated config:', skey, config[key][skey])
        }

        writeConfig(config);
    }
}

function deleteConfig() {
    let config = require(configPath);
    // console.log(config)
    let key = currentConfigElement['key'];
    let skey = currentConfigElement['skey'];
    let i = currentConfigElement['i']

    if (skey == 'annotations') {
        config[key][skey].splice(i, 1);
    }

    writeConfig(config);
 
}


function writeConfig(config) {
    // reset intermediateConfig object
    intermediateConfig = {};

    let configText = "var config = "
    configText += JSON.stringify(config)
    configText += "; try { module.exports = config; } catch {};"

    fs.writeFile(configPath, configText, (err) => { if (err) { console.log(err); } })

    edited = false;

    var event = new Event('change');
    package.dispatchEvent(event);
}
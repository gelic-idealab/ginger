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

        for(k of Object.keys(intermediateConfig)) {
            config[key][skey][i][k] = intermediateConfig[k];
        }

        console.log('updated config:', k, config[key][skey][i][k])

        let configText = "var config = "
        configText += JSON.stringify(config)
        configText += "; try { module.exports = config; } catch {};"

        fs.writeFile(configPath, configText, (err) => { if (err) { console.log(err); } })

        edited = false;

        var event = new Event('change');
        package.dispatchEvent(event);

    }
}
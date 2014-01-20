var readdirp = require('readdirp');
var argv = require('optimist');
var fs = require('fs');

// Extract the 3akai-ux root directory
var rootDir = argv.rootDir;

/**
 * Extract the paths of all the available bundles (.properties files) in the code base
 *
 * @param  {Function}     callback              Standard callback function
 * @param  {String[]}     callback.bundles      List of paths for the available bundles
 */
var collectBundles = function(callback) {
    var bundles = [];

    // Loop through all available core and widget translation bundles and store their paths
    readdirp({ 'root': rootDir, 'fileFilter': '*.properties' }, function(entry) {
        bundles.push(entry.fullPath);
    }, function(err, res) {
        callback(bundles);
    });
};

var convertBundle = function(path) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            return console.log('Failed to read ' + path +'. ' + err);
        }

        // Split the data on new line
        data = data.split('\n');

        var filteredData = [];

        // Pre-filter dismissable lines
        for (var line = 0; line < data.length; line++) {
            if (data[line] && data[line].substring(0, 1) !== '#') {
                filteredData.push(data[line]);
            }
        }

        // Store the final JSON output in this variable
        var jsonData = '\n';

        // Split every line on '=' and rewrite it to JSON
        for (var line = 0; line < filteredData.length; line++) {
            if (filteredData[line] && filteredData[line].substring(0, 1) !== '#') {
                var splitLine = filteredData[line].split('=');
                jsonData += '    "' + splitLine[0].replace(/^\s+|\s+$/gm, '') + '": "';
                splitLine.splice(0, 1);
                jsonData += splitLine.join('=').replace(/\\=/g, '=').replace(/\"/g, '\\"').replace(/^\s+|\s+$/gm, '').replace(/\\:/g, ':').replace(/\\!/g, '!').replace(/\\ /g, ' ') + '"';
                if (line !== filteredData.length - 1) {
                    jsonData += ',\n';
                } else {
                    jsonData += '\n';
                }
            }
        }

        var bundle = '{' + jsonData + '}';

        fs.writeFile(path.split('.properties')[0] + '.json', bundle, function(err) {
            if (err) {
                return console.log('Failed to write ' + path +'. ' + err);
            }
        });
    });
};

/**
 * Update the widget manifest files to reflect the available languages for each widget
 *
 * @param  {String[]}     bundles               List of paths for the available bundles
 */
var updateWidgetManifests = function(bundles) {
    // Loop through all widget manifests
    readdirp({ 'root': rootDir, 'fileFilter': 'manifest.json' }, function(entry) {
        // Load the widget manifest
        var widgetManifest = require(entry.fullPath);

        if (widgetManifest.i18n) {
            for (var lang in widgetManifest.i18n) {
                // Replace '.properties' with '.json'
                widgetManifest.i18n[lang] = widgetManifest.i18n[lang].replace('.properties', '.json');
            }
            console.log(widgetManifest);
            // Re-publish the manifest file
            fs.writeFile(entry.fullPath, JSON.stringify(widgetManifest, null, 4) + '\n');
        }
    }, function() {});
};

collectBundles(function(bundles) {
    for (var i = 0; i < bundles.length; i++) {
        convertBundle(bundles[i]);
    }
    updateWidgetManifests();
});

var mandrill        = require('mandrill-api/mandrill');
var path            = require('path');
var fs              = require('fs');
var walk            = require('./walk');
var CustomError     = require('./errors/custom-error');

module.exports = function(mmhtConfig) {

    mandrill_client = new mandrill.Mandrill(mmhtConfig.MANDRILL_API_KEY);

    // Iterate Templates Dir
    return walk(mmhtConfig.TEMPLATES_DIR, function (err, allTemplatePaths) {
        if (err) throw err;

        //only care about json files...
        mcTemplateJSONPaths = allTemplatePaths.filter(function(somePath){return somePath.indexOf('.mc.json') != -1;});

        // add or update each mandrill template
        mcTemplateJSONPaths.forEach(function (mcTemplateJSONPath) {

            var mcTemplateJSON  = require(mcTemplateJSONPath);

            // Make sure we have the latest html on file.
            mcTemplateJSON.code = fs.readFileSync(mcTemplateJSONPath.replace('.mc.json', '.mc.html'), 'utf8');

            mandrill_client.templates.add(mcTemplateJSON, function (result) {
                console.log("✓ Added" + mcTemplateJSONPath);

            }, function (e) {

                // IF Template Already Exists
                if (e.code == 6){
                    //console.log('mandrill template already exists, need to update it...')

                    mandrill_client.templates.update(mcTemplateJSON, function(result) {
                        console.log("✓ Updated " + path.parse(mcTemplateJSONPath).base);

                    }, function(e) {
                        var e = 'Unable to Update Mandrill Template: ' + mcTemplateJSONPath + ' >> ' + e;
                        throw new CustomError(e, 600);
                    });

                } else {
                    var e = 'Unable to Add Mandrill Template: ' + mcTemplateJSONPath + ' >> ' + e;
                    throw new CustomError(e, 601);
                }
            });
        });
    });


};
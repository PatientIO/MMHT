var mandrill        = require('mandrill-api/mandrill');
var path            = require('path');
var fs              = require('fs');
var walk            = require('./walk');
var CustomError     = require('./errors/custom-error');

module.exports = function(mmtConfig) {

    mandrill_client = new mandrill.Mandrill(mmtConfig.MANDRILL_API_KEY);

    // Iterate Templates Dir
    walk(mmtConfig.TEMPLATES_DIR, function (err, allTemplatePaths) {
        if (err) throw err;

        // Get only the mandrill templates json
        mandrillTemplateJSONPaths = allTemplatePaths.filter(function(somePath){return somePath.indexOf('.mailchimp.json') != -1;});

        // add or update each mandrill template
        mandrillTemplateJSONPaths.forEach(function (mandrillTemplateJSONPath) {

            var mandrillTemplateJSON  = require(mandrillTemplateJSONPath);

            // Make sure we have the latest html on file.
            mandrillTemplateJSON.code = fs.readFileSync(mandrillTemplateJSONPath.replace('.mailchimp.json', '.mailchimp.html'), 'utf8');

            mandrill_client.templates.add(mandrillTemplateJSON, function (result) {
                console.log("✓ Added" + mandrillTemplateJSONPath);

            }, function (e) {

                // IF Template Already Exists
                if (e.code == 6){
                    //console.log('mandrill template already exists, need to update it...')

                    mandrill_client.templates.update(mandrillTemplateJSON, function(result) {
                        console.log("✓ Updated " + path.parse(mandrillTemplateJSONPath).base);

                    }, function(e) {
                        var e = 'Unable to Update Mandrill Template: ' + mandrillTemplateJSONPath + ' >> ' + e;
                        throw new CustomError(e, 600);
                    });

                } else {
                    var e = 'Unable to Add Mandrill Template: ' + mandrillTemplateJSONPath + ' >> ' + e;
                    throw new CustomError(e, 601);
                }
            });
        });
    });


};
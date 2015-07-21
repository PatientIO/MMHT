var fs              = require('fs');
var path            = require('path');
var _               = require('lodash');
var handlebars      = require("node-handlebars");
var CustomError     = require('./errors/custom-error');
var walk            = require('./walk');

module.exports = function(mmtConfig){

    var hbs = handlebars.create();

    return walk(mmtConfig.TEMPLATES_DIR, function (err, allTemplatePaths) {
        if (err) throw err;

        var metaTemplateConfig;

        //only care about json files...
        metaTemplateJSONPaths = allTemplatePaths.filter(function(somePath){return somePath.indexOf('.handlebars.json') != -1;});

        metaTemplateJSONPaths.forEach(function (metaTemplateJSONPath) {

            try {
                metaTemplateConfig = require(metaTemplateJSONPath);
            } catch (jsonParseError) {
                var e = 'INVALID JSON FILE:' + metaTemplateJSONPath + ' >> ' + jsonParseError;
                throw new CustomError(e, 502);
            }

            var metaTemplateHTMLPath = metaTemplateJSONPath.replace(".handlebars.json", ".handlebars.html");
            var mandrillTemplateHTMLPath = metaTemplateHTMLPath.replace(".handlebars.html", ".mailchimp.html");

            //console.log('meta_template_config', metaTemplateConfig)

            //console.log('meta_template_html_path', metaTemplateHTMLPath);
            //console.log('meta_template_json_path', metaTemplateJSONPath);
            //
            //console.log('mandrill_html_template_path', mandrillTemplateHTMLPath);

            hbs.engine(metaTemplateHTMLPath, metaTemplateConfig, function(err, mandrillTemplateHTML) {
                if (err) {
                    throw new CustomError("Error: Handlebars Template Engine: " + err, 503);
                }

                fs.writeFile(mandrillTemplateHTMLPath, mandrillTemplateHTML, function(err) {
                    if(err) {
                        throw new CustomError("Error: Writing Mandrill Template to File: " + err, 504);
                    } else{
                        console.log("✓ " + mandrillTemplateHTMLPath);
                    }

                });
            });

        });
    });


};


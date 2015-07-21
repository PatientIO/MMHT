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

        //only care about json files...
        mcTemplateJSONPaths = allTemplatePaths.filter(function(somePath){return somePath.indexOf('.mc.json') != -1;});

        mcTemplateJSONPaths.forEach(function (mcTemplateJSONPath) {

            var pathObj = path.parse(mcTemplateJSONPath);

            var hbTemplateJSONPath = path.join(pathObj.dir, 'hb/', pathObj.name.replace(".mc", "." + mmtConfig.HANDLEBARS_KEY + ".json"));
            var hbTemplateHTMLPath = path.join(pathObj.dir, 'hb/', "_" + pathObj.name.replace(".mc", ".html"));

            var mcTemplateHTMLPath = mcTemplateJSONPath.replace(".mc.json", ".mc.html");

            var hbTemplateJSON = require(hbTemplateJSONPath);

            hbs.engine(hbTemplateHTMLPath, hbTemplateJSON, function(err, mcTemplateHTML) {
                if (err) {
                    throw new CustomError("Error: Handlebars Template Engine: " + err, 503);
                }

                fs.writeFile(mcTemplateHTMLPath, mcTemplateHTML, function(err) {
                    if(err) {
                        throw new CustomError("Error: Writing Mandrill Template to File: " + err, 504);
                    } else{
                        console.log("✓ " + mcTemplateHTMLPath);
                    }
                });
            });

        });
    });


};


var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var slug = require('slug')
var mandrill = require('mandrill-api/mandrill');
var CustomError = require('./errors/custom-error');

module.exports = function (mmhtConfig) {
    console.log('Downloading Templates from Mandrill');

    mandrill_client = new mandrill.Mandrill(mmhtConfig.MANDRILL_API_KEY);

    var label = "mc-template";

    mandrill_client.templates.list({"label": label}, function (mandrillTemplates) {

        mandrillTemplates.forEach(function (mandrillTemplate) {

            console.log('saving: ', mandrillTemplate.name);

            var templateSlug = slug(mandrillTemplate.name);
            var templateJSONDir = path.join(mmhtConfig.DOWNLOADS_DIR, templateSlug);
            var templateJSONPath = path.join(templateJSONDir, templateSlug + ".mc.json");
            var templateJSON = JSON.stringify(mandrillTemplate);

            mkdirp(templateJSONDir, function (err) {

                // path was created unless there was error

                fs.writeFile(templateJSONPath, templateJSON, function (err) {
                    if (err) {
                        throw new CustomError("Error: Writing Mandrill Template JSON to File: " + err, 508);
                    } else {
                        console.log("✓ " + templateJSONPath);
                    }
                });
            });

            var templateHTMLDir = path.join(mmhtConfig.DOWNLOADS_DIR, templateSlug, "hb");
            var templateHTMLPath = path.join(templateHTMLDir, "_" + templateSlug + ".html");
            var templateHTML = mandrillTemplate.code;

            mkdirp(templateHTMLDir, function (err) {

                fs.writeFile(templateHTMLPath, templateHTML, function (err) {
                    if (err) {
                        throw new CustomError("Error: Writing Mandrill Template HTML to File: " + err, 509);
                    } else {
                        console.log("✓ " + templateHTMLPath);
                    }
                });

            });

        });

    }, function (e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Invalid_Key - Invalid API key
    });
};
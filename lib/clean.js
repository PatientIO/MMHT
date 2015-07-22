var fs = require('fs-extra');
var path = require('path');
var walk = require('./walk');
var mkdirp = require('mkdirp');

module.exports = function (mmhtConfig) {

    return walk(mmhtConfig.TEMPLATES_DIR, function (err, allTemplatePaths) {
        if (err) throw err;

        try {
            //only care about mail chimp templates, we are about to delete them all.
            mailchimpTemplatePaths = allTemplatePaths.filter(function (somePath) {
                return somePath.indexOf('.mc.html') != -1;
            });

            mailchimpTemplatePaths.forEach(function (mailChimpTemplatePath) {
                fs.remove(mailChimpTemplatePath, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });

            });
            console.log('cleaned templates folder: ', mmhtConfig.TEMPLATES_DIR)

            fs.remove(mmhtConfig.DOWNLOADS_DIR, function (err) {
                if (err) {
                    console.log(err);
                }
            });

            mkdirp(mmhtConfig.DOWNLOADS_DIR, function(err) {
                console.log('cleaned downloads folder: ', mmhtConfig.DOWNLOADS_DIR);
            });


        } catch (error) {
            console.log('do nothing')
        }

    });

};


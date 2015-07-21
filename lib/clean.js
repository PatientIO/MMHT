var fs = require('fs-extra');
var path = require('path');
var walk = require('./walk');

module.exports = function (mmtConfig) {

    return walk(mmtConfig.TEMPLATES_DIR, function (err, allTemplatePaths) {
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

            })
        } catch (error) {
            console.log('do nothing')
        }

    });

};


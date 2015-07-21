var moment              = require("moment");
var fs                  = require("fs");
var mandrill            = require('mandrill-api/mandrill');
var CustomError         = require('./errors/custom-error');


var report = function(mmtConfig){
    mandrill_client = new mandrill.Mandrill(mmtConfig.MANDRILL_API_KEY);

    var label = "mc-template";

    var mandrillReportHTML = fs.readFileSync(mmtConfig.MAILCHIMP_REPORT, 'utf8');

    mandrill_client.templates.list({"label": label}, function(result) {
        var templateNames = result.map(function(r){return r.name;});

        var payload = {
            "template_name": "Meta Report",
            "template_content": [
                {
                    "name": "Meta Report",
                    "content": mandrillReportHTML
                }
            ],
            "message": {
                "merge": true,
                "merge_language": "mailchimp",
                "global_merge_vars": require("../mandrill/global_merge_vars.json"),
                "merge_vars": [
                    {
                        "rcpt": "example+test+mandrill@example.com",
                        "vars": [
                            {
                                "name": "merge2",
                                "content": "merge2 content"
                            },
                            {
                                "name": "MC_TEMPLATES_LIST",
                                "content": templateNames.join("<br/>")
                            }
                        ]
                    }
                ],
                "html": mandrillReportHTML,
                "subject": "Mandrill Meta Templates Report: " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                "from_email": "example+mandrill@example.com",
                "from_name": "Mandrill Meta Templates",
                "to": [
                    {
                        "email": "example+test+mandrill@example.com",
                        "name": "Mandrill Test",
                        "type": "to"
                    }
                ],
                "headers": {
                    "Reply-To": "example+reply@example.com"
                }
            },
            "async": false,
            "ip_pool": null,
            "send_at": null,
            "key": mmtConfig.MANDRILL_API_KEY
        };

        mandrill_client.messages.sendTemplate(payload, function(result) {
            console.log("✓ Meta Report sent to: ", result[0].email);

        }, function(e) {
            throw new CustomError("Error: Unable to send Meta Report" + e, 700);
        });

    }, function(e) {
        throw new CustomError("Error: Unable to get List of Templates" + e, 701);
    });

};

module.exports = function(mmtConfig){

    return report(mmtConfig);

};


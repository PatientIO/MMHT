var moment              = require("moment");
var fs                  = require("fs");
var mandrill            = require('mandrill-api/mandrill');
var CustomError         = require('./errors/custom-error');


var test = function(mmtConfig){
    mandrill_client = new mandrill.Mandrill(mmtConfig.MANDRILL_API_KEY);

    var mandrillReportHTML = fs.readFileSync(mmtConfig.TEST_TEMPLATE, 'utf8');

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
                    "rcpt": "mail@example.com",
                    "vars": [
                        {
                            "name": "merge2",
                            "content": "merge2 content"
                        },
                        {
                            "name": "MC_TEMPLATES_LIST",
                            "content": "SOME MAIL CHIMP VARs here"
                        }
                    ]
                }
            ],
            "html": mandrillReportHTML,
            "subject": "MMHT: " + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
            "from_email": "mail@example.com",
            "from_name": "Mandrill Meta Templates",
            "to": [
                {
                    "email": "mail@example.com",
                    "name": "Mandrill Test",
                    "type": "to"
                }
            ],
            "headers": {
                "Reply-To": "mail@example.com"
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


};

module.exports = function(mmtConfig){

    return test(mmtConfig);

};


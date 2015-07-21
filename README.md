MMHT
=======================

Experimental tool, use at your own risk. See LICENSE

### Mandrill Mailchimp Templates with Handlebars.

This tool makes it easy to use 2 template languages, and makes it easy to push compiled templates to mandrill.
Useful for Localization, or other cases where you want to template a template.

## Getting Started

Add your Mandrill API key to mmhtConfig.json:

```
{
  "META_TEMPLATES_DIR"                    : "./meta_templates",
  "MANDRILL_API_KEY"                      : "XXXXX",
  "MANDRILL_META_TEMPLATES_REPORT_HTML"   : "./meta_templates/meta_report/meta_report.mandrill.html"
}

```

Update all email addresses, from example.com to whatever...

Organize your templates and associated json in the templates dir.

For Example:

```
./templates/hello/hello.handlebars.html
./templates/hello/hello.handlebars.json
```

Will be used by the script to build:

```
./templates/hello/hello.mailchimp.html
```

Which, in turn, is added to:

```
./templates/hello/hello.mailchimp.json
```

and then uploaded to Mandrill via their RESTful API.

## Usage

```
npm install && npm start
```





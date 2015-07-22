MMHT
=======================

Experimental tool, use at your own risk. See LICENSE

### Mandrill Mailchimp Templates with Handlebars.

Uses handlebars to template mailchimp templates, and push them to mandrill.
Useful for Localization, or other cases where you want to template a template.

## Getting Started

You must create a file called "mmhtConfig.json" in the root directory, and it should look like this:

```
{
  "MANDRILL_API_KEY"        : "YOUR MANDRILL API KEY HERE",
  "HANDLEBARS_KEY"          : "en",
  "TEMPLATES_DIR"           : "./templates",
  "DOWNLOADS_DIR"           : "./downloads",
  "TEST_TEMPLATE"           : "./templates/meta_report/meta_report.mc.html"
}
```

Update all email addresses, from example.com to whatever...

Organize your templates and associated json language files in the templates dir.

For Example:

```
./templates/hello/hb/_hello.html
./templates/hello/hb/hello.en.json
```

Will be used by the script to build:

```
./templates/hello/hello.mc.html
```

Which, in turn, is added to:

```
./templates/hello/hello.mc.json
```

and then uploaded to Mandrill via their RESTful API.

## Usage

```
npm install && gulp
```

Support specifying a language directly (assuming you have added the required language file):

```
gulp compile --lang zh
```





# Civinky: Pug and Inky for CiviMail

Convert Pug with Inky into html ready for CiviMail.

This repository contains the Civinky library; a simple web service based on this library; and a browserified version of the library.

You may also be interested in the [CiviCRM Inky Compose](https://github.com/3sd/civicrm-inky-compose) extension that allows you to compose with Inky using the CiviMail's UI.

## Installation

1. Download Civinky from https://github.com/3sd/civinky-service.
2. `cd` to the downloaded directory and `npm install`
3. Run the service with `npm run service`

Civinky is now ready to generate HTML in response to post requests on http://localhost:30649/generate.

### Specifying a port

You can specify a specific port with `CIVINKY_PORT=N npm run service` where N is the number of the port you want to run it on.

### Running Civinky with PM2

You can run Civinky with PM2 - an 'advanced, production process manager for Node.js' - as follows:

1. Download and install pm2
2. Create a process.yml file.
```yaml
# process.yml
apps:
  - script: /var/www/civinky-service/service.js
    env:
      CIVINKY_PORT: 30649 # optional, allows you to specific a port
```
3. Start `pm2 start process.yml`

## Usage

1. Make a post requests to http://localhost:3000/generate. Include your params as json in the request body (see below for details).
2. You will recive response containing email friendly HTML.

Hint: tools like [Postman](https://www.getpostman.com/) are useful for experimenting with requests.

### Parameters

#### pug

*Valid pug* for example:

```pug
container
  row
    columns
      h1 Hello #{planet}!
```

Some tips on using Pug and inky to generate email friendly HTML for CiviMail:

* Use Inky tags rather than html tags when available to ensure that the generated HTML is email friendly.
* Insert values from the json object, use the following Pug syntax: `#{key}`
* Add smarty tokens as normal, e.g. `{contact.first_name}`.
* Remember that the entirety of Pug's syntax (control flow, etc.) is available for your use.

#### css

*Valid CSS* for example:
```css
h1{color:red}
```

This CSS will be appended to Foundation's base CSS and inlined into the html.

#### json

*A valid json object*, for example:
```json
{"planet":"World"}
```
This will be available for use in the Pug.

#### snippet

*Boolean*, defaults to false.

By default, Civinky wraps the Pug with appropriate HTML to ensure proper rendering across clients. Setting snippet to true will prevent the output being wrapped, which is useful, for example, if you want to use Civinky to generate HTML for a CiviMail token that will be included as part of another Civinky based email.

## Demo

To see Civinky in action, visit https://civinky.demo.3sd.io/.

You might also be interested in this extension that implements tokens based on Civinky: https://github.com/elifesciences/civicrm-elife-token

## Civinky in the browser

There is a browserified version of Civinky, which runs in the browser and can be found in `dist/civinky.bundle.js`. This version is used in the [CiviCRM Inky Compose](https://github.com/3sd/civicrm-inky-compose) extension.

The browserified version exports a promise (CRM.civinky) that can be used as follows:

```js
CRM.civinky({pug: 'p hello world', css: "p {color:red}"})
.then(result => console.log(result))
```

Test out Civinky in the browser with the `civinky-browserified.html` file.

A gulp script to create the browserified version can be found in `gulpfile.js` and can be run with `gulp browserify`.
Beware that it the browserified version weighs it at a fairly hefty 1.1MB - help on trimming off some fat welcome.

## Tests

The Civinky service has a simple suite of tests that also serve to test the library. Ensure that the service is running as outlined above and then run `npm test` to execute the tests.

## Contributing

PRs are very welcome. Feel free to open an issue to discuss any improvements first if that would be helpful.

Please ensure all tests are passing and don't forget to write new tests as appropriate for any new functionality before submitting PRs.

## Credits

Funding provided by [eLife Sciences](http://elifesciences.org/), a unique, non-profit collaboration between the funders and practitioners of research to improve the way important results are presented and shared.

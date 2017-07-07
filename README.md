# Civinky: Pug and Inky for CiviMail

A web service that converts a Pug template, written with Inky tags to html ready for CiviMail.

## Installation

1. Download Civinky from https://github.com/3sd/civinky-service.
2. `cd` to the downloaded directory and `npm install`
3. Run the service with `node index.js`

Civinky should be ready to generate HTML via a get request to http://localhost:3000/generate.

### Specifying a port

You can specify a specific port with

`CIVINKY_PORT=N node index.js`

### Using PM2

PM2 is an 'advanced, production process manager for Node.js'. Run Civinky with PM2 as follows:

1. Create a process.yml file.
```yaml
# process.yml
apps:
  - script: /var/www/civinky-service/index.js
    env:
      CIVINKY_PORT: 3001 # optional, allows you to specific a port
```
2. Start `pm2 start process.yml`

## Usage

1. Post a request to http://localhost:3000/generate with x-www-form-urlencoded params (see below)

2. You will receive a response containing email friendly HTML.

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
* The entirety of Pug's syntax (control flow, etc.) is available for your use.


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

By default, Civinky surrounds the Pug specified above with an opening !DOCTYPE tag, a HEAD tag, and some enclosing HTML before the CSS is in-lined. Setting snippet to true stops this from happening. which is useful, for example, when using Civinky to generate HTML for a CiviMail token.

### Examples

To see Civinky in action, visit https://civinky.demo.3sd.io/.

A CiviCRM extension that implements a Civinky token: https://github.com/3sd/civicrm-elife-article-token



## Credits

Funding provided by [eLife Sciences](http://elifesciences.org/), a unique, non-profit collaboration between the funders and practitioners of research to improve the way important results are presented and shared.

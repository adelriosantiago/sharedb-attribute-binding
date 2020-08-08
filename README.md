# sharedb-attribute-binding

A ShareDB binding that allows you to bind element attributes like `id`, `class`, `style`, etc. Element's value is always written even when changing another attribute.
Based on https://github.com/stanographer/sharedb-generic-binding.

_As used in [boy.dog](http://boy.dog). The web library that allows you to create real-time collaborative webpages._

## Usage

```bash
npm install --save sharedb-attribute-binding
```

```js
// Require it.
const AttributeGenericBinding = require("sharedb-attribute-binding");

// Setup the connection.
const socket = new WebSocket("ws://YOUR_HOST:YOUR_PORT", [], socketOptions);
const connection = new sharedb.Connection(socket);
const doc = connection.get("examples", "textarea");

// Subscribe to the document.
doc.subscribe((err) => {
  if (err) throw err;
  const element = document.getElementById("YOUR_DIV_OR_WHATEVER");

  // Use any of the following:

  //const binding = new AttributeGenericBinding(element, doc, ["content"], ""); //To set the input/textarea value
  //const binding = new AttributeGenericBinding(element, doc, ["content"], "id"); //To set the element `id`
  //const binding = new AttributeGenericBinding(element, doc, ["content"], "href"); //To set the element `href`
  //const binding = new AttributeGenericBinding(element, doc, ["content"], "src"); //To set the element `src`
  //const binding = new AttributeGenericBinding(element, doc, ["content"], "html"); //To set the element `innerHTML`
  //const binding = new AttributeGenericBinding(element, doc, ["content"], "class"); //To set the element `className` (this keeps old classes)
  //or
  //const binding = new AttributeGenericBinding(element, doc, ["content"], function(element, value) { [CUSTOM_FUNCTION] }); //To set a custom function callback

  // All examples above will also set elements' value (i.e. to bind an input use `const binding = new AttributeGenericBinding(element, doc, [], "")`)

  binding.setup();
});
```

## Tests

Run `npm run test`. They all should work but bear in mind that no tests have been created for all attributes (src, href, id, etc).

## License

MIT - Alejandro del Río Santiago [@adelriosantiago](https://twitter.com/adelriosantiago) ([boy.dog](http://boy.dog/))

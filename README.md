# sharedb-attribute-binding

A ShareDB binding that allows you to bind element attributes like `id`, `class`, `style` and of course input's `value`.
Based on https://github.com/stanographer/sharedb-generic-binding.

*As used in [boy.dog](www.boy.dog). The web library that allows you to create real-time collaborative webpages.*

## Usage

```bash
npm install --save sharedb-attribute-binding
```

```js
// Require it.
const AttributeGenericBinding = require('sharedb-attribute-binding');

// Setup the connection.
const socket = new WebSocket('ws://YOUR_HOST:YOUR_PORT', [], socketOptions);
const connection = new sharedb.Connection(socket);
const doc = connection.get('examples', 'textarea');

// Subscribe to the document.
doc.subscribe((err) => {
  if (err) throw err;
  const element = document.getElementById('YOUR_DIV_OR_WHATEVER');
  const binding = new AttributeGenericBinding(element, doc, [], "id"); //To set the element `id`
  //const binding = new AttributeGenericBinding(element, doc, [], "href"); //To set the element `href`
  //const binding = new AttributeGenericBinding(element, doc, [], "src"); //To set the element `src`
  //const binding = new AttributeGenericBinding(element, doc, [], "html"); //To set the element `innerHTML`
  //const binding = new AttributeGenericBinding(element, doc, [], "class"); //To set the element `className` (this keeps old classes)
  //or
  //const binding = new AttributeGenericBinding(element, doc, [], function(element, value) { [CUSTOM_FUNCTION] }); //To set a custom function callback
  
  binding.setup();
});
```

## Tests

Run `npm run test`. They all should work but bear in mind that no tests have been created for all attributes (src, href, id, etc).

## License

MIT - Alejandro del Río Santiago [@adelriosantiago](https://twitter.com/adelriosantiago) ([boy.dog](http://boy.dog/))

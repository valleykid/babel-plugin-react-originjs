# babel-plugin-react-originjs
Make react-components into original js

[![npm version](https://img.shields.io/npm/v/babel-plugin-react-originjs.svg)](https://www.npmjs.org/package/babel-plugin-react-originjs)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-react-originjs.svg)](https://www.npmjs.org/package/babel-plugin-react-originjs)

A babel plugin that make react-components into original js.

Before:

```js
ReactDOM.render(<HelloWorld />, document.getElementById('wrap'))
```

After:

```js
window['ICAT'] && window['ICAT'].react? ICAT.react(function(el){ ReactDOM.render(<HelloWorld />, el); }) : ReactDOM.render(<HelloWorld />, document.getElementById('wrap'));
```

## Installation

```sh
$ npm install babel-plugin-react-originjs
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["react-originjs"]
}
```

### Via CLI

```sh
$ babel --plugins react-originjs script.js
```

### Via Node API

```js
require('babel-core').transform('code', {
  plugins: ['react-originjs']
});
```

## License

MIT

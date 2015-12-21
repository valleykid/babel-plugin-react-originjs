'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var types = _ref.types;

  var methodName = undefined;

  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path) {
        var node = path.node;
        var value = node.source.value;

        if (value !== 'react' && value !== 'react-dom') {
          node.specifiers.forEach(function (spec) {
            if (types.isImportSpecifier(spec)) {
              methodName = value + '/' + spec.imported.name;
            }
            if (types.isImportDefaultSpecifier(spec)) {
              methodName = value + '/' + spec.local.name;
            }
          });
          methodName = methodName || 'noname';
        }
      },
      CallExpression: function CallExpression(path, state) {
        var node = path.node;
        var file = path.hub.file;
        var _node$callee = node.callee;
        var name = _node$callee.name;
        var object = _node$callee.object;
        var property = _node$callee.property;

        var t = types;

        if (!types.isIdentifier(node.callee)) {
          if (object && (object.name || '').toLowerCase() === 'reactdom') {
            (function () {
              var fn = 'function(){\n              var argus = Array.prototype.slice.call(arguments),\n                rcDom = argus[1], el = argus[4], vdom = argus[5]; \n              rcDom.render(vdom, el);\n            }';
              var argus = t.arrayExpression(node.arguments);
              var icatReact = "window['ICAT']? window['ICAT'].react : ";
              var arr = [t.stringLiteral(methodName), node.callee.object];
              node.arguments.map(function (arg) {
                if (t.isJSXElement(arg)) {
                  arr.push(arg.openingElement.name);
                  if (arg.openingElement.attributes.length) {
                    (function () {
                      var attrs = [];
                      arg.openingElement.attributes.map(function (item) {
                        attrs.push(t.objectProperty(t.stringLiteral(item.name.name), item.value));
                      });
                      arr.push(t.objectExpression(attrs));
                    })();
                  } else {
                    arr.push(t.identifier('null'));
                  }
                } else {
                  arr.push(arg);
                }
              });

              arr.push(node.arguments[0]);
              path.replaceWith(t.callExpression(t.identifier("(" + icatReact + fn + ")"), arr));
            })();
          }
        }
      }
    }
  };
};
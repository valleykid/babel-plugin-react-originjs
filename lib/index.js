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

        if (value === 'react') {
          var t = types;
          var name = undefined;
          node.specifiers.forEach(function (spec) {
            if (types.isImportSpecifier(spec)) {
              name = spec.imported.name;
            }
            if (types.isImportDefaultSpecifier(spec)) {
              name = spec.local.name;
            }
          });
          var assignEx = t.assignmentExpression('=', t.identifier('window.ReactForiCat'), t.identifier(name ? name : 'null'));
          path.insertAfter(t.expressionStatement(assignEx));
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
              var arr = [t.stringLiteral(methodName), node.callee.object]; //[0]name, [1]rcDOM
              node.arguments.map(function (arg) {
                if (t.isJSXElement(arg)) {
                  arr.push(arg.openingElement.name); //[2]widget
                  if (arg.openingElement.attributes.length) {
                    (function () {
                      //[3]argus
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
                  arr.push(arg); //[4]node
                }
              });

              arr.push(node.arguments[0]); //[5]vDom
              path.replaceWith(t.callExpression(t.identifier("(" + icatReact + fn + ")"), arr));
            })();
          }
        }
      }
    }
  };
};
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
          });
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
          if (object && object.name.toLowerCase() === 'reactdom') {
            var fn = 'function(render, name, argus){ render.apply(this, argus); }';
            var argus = t.arrayExpression(node.arguments);
            var icatReact = "window['ICAT']? window['ICAT'].react : ";

            path.replaceWith(t.callExpression(t.identifier("(" + icatReact + fn + ")"), [node.callee, t.stringLiteral(methodName), argus]));
          }
        }
      }
    }
  };
};
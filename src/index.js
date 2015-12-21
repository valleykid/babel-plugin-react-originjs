export default function({ types }) {
  let methodName;

  return {
    visitor: {
      ImportDeclaration(path) {
        const { node } = path;
        const { value } = node.source;
        
        if(value!=='react' && value!=='react-dom'){
          node.specifiers.forEach(spec => {
            if (types.isImportSpecifier(spec)) {
              methodName = value + '/' + spec.imported.name;
            }
          }); 
        }
      },

      CallExpression(path, state) {
        const { node } = path;
        const { file } = path.hub;
        const { name, object, property } = node.callee;
        let t = types;

        if (!types.isIdentifier(node.callee)) {
          if(object && object.name.toLowerCase()==='reactdom'){
            let fn = 'function(render, name, argus){ render.apply(this, argus); }';
            let argus = t.arrayExpression(node.arguments);
            let icatReact = "window['ICAT']? window['ICAT'].react : ";
            
            path.replaceWith(
              t.callExpression(
                t.identifier("(" + icatReact + fn + ")"),
                  [node.callee, t.stringLiteral(methodName), argus])
            )
          }
        }
      },
    },
  };
}
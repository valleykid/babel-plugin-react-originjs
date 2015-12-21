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
            if (types.isImportDefaultSpecifier(spec)) {
              methodName = value + '/' + spec.local.name;
            }
          });
          methodName = methodName || 'noname';
        }
      },

      CallExpression(path, state) {
        const { node } = path;
        const { file } = path.hub;
        const { name, object, property } = node.callee;
        let t = types;

        if (!types.isIdentifier(node.callee)) {
          if(object && (object.name||'').toLowerCase()==='reactdom'){
            let fn = `function(){
              var argus = Array.prototype.slice.call(arguments),
                rcDom = argus[1], el = argus[4], vdom = argus[5]; 
              rcDom.render(vdom, el);
            }`;
            let argus = t.arrayExpression(node.arguments);
            let icatReact = "window['ICAT']? window['ICAT'].react : ";
            let arr = [t.stringLiteral(methodName), node.callee.object];
            node.arguments.map(arg => {
              if(t.isJSXElement(arg)) {
                arr.push(arg.openingElement.name);
                if(arg.openingElement.attributes.length){
                  let attrs = [];
                  arg.openingElement.attributes.map(item=>{
                    attrs.push(t.objectProperty(t.stringLiteral(item.name.name), item.value));
                  });
                  arr.push(t.objectExpression(attrs));
                } else {
                  arr.push(t.identifier('null'));
                }
              } else {
                arr.push(arg);
              }
            });

            arr.push(node.arguments[0]);
            path.replaceWith(
              t.callExpression(t.identifier("(" + icatReact + fn + ")"), arr)
            )
          }
        }
      },
    },
  };
}
const recast = require('recast');
const fs = require('fs-extra');
const glob = require('glob');

// Get a list of all JavaScript files in the src directory
const files = glob.sync('src/**/*.js');

files.forEach(file => {
    const code = fs.readJsonSync(file, 'utf-8');
    const ast = recast.parse(code, { sourceType: 'module' });

    recast.visit(ast, {
        visitImportDeclaration(path) {
            const node = path.node;
            const defaultSpecifier = node.specifiers.find(specifier => specifier.type === 'ImportDefaultSpecifier');
            const namedSpecifiers = node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier');

            const newNodes = [];

            if (defaultSpecifier) {
                newNodes.push(recast.types.builders.variableDeclaration('const', [
                    recast.types.builders.variableDeclarator(
                        defaultSpecifier.local,
                        recast.types.builders.callExpression(
                            recast.types.builders.identifier('require'),
                            [node.source]
                        )
                    )
                ]));
            }

            if (namedSpecifiers.length > 0) {
                newNodes.push(recast.types.builders.variableDeclaration('const', [
                    recast.types.builders.variableDeclarator(
                        recast.types.builders.objectPattern(namedSpecifiers.map(specifier => recast.types.builders.property('init', specifier.local, specifier.local))),
                        recast.types.builders.callExpression(
                            recast.types.builders.identifier('require'),
                            [node.source]
                        )
                    )
                ]));
            }

            path.replace(...newNodes);
            return false;
        }
    });

    const output = recast.print(ast).code;
    fs.writeJsonSync(file, output);
});
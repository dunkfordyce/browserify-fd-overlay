var transform_tools = require('browserify-transform-tools'),
    path = require('path'),
    fs = require('fs');

var cwd = process.cwd();

module.exports = transform_tools.makeStringTransform('overlay', {
}, function(content, options, done) { 
    var fn = options.file.replace(cwd, ''),
        base = options.config.root,
        overlay = path.join(base, fn);

    if( fs.existsSync(overlay) ) { 
        overlay = path.relative(path.dirname(fn).substr(1), overlay);
        if( overlay[0] != '.' ) overlay = './'+overlay;
        console.warn('found overlay', overlay);

        content = content + ';\n// overlay\nconsole.log("'+options.file+' running overlay", module.exports); module.exports = (function(x) { var t = require("'+overlay+'")(x); return t || x;})(module.exports); console.log("'+options.file+' exports now", module.exports);';
    }

    done(null, content);
});

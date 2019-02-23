const { src, dest } = require('gulp');

function defaultTask(cb) {
    // place code for your default task here
    cb();
}
  
function file() {
    return src('src/*.js')
        .pipe(dest('output/'));
}

// exports.default = defaultTask
exports.default = file
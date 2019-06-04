exports.myHandler = function(event, context, callback) {
    console.log("process.env.PATH", process.env['PATH']);
}
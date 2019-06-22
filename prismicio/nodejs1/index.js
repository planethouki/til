var Prismic = require('prismic-javascript');

var apiEndpoint = "https://mypersonalplan.prismic.io/api/v2";

var req = null;

Prismic.getApi(apiEndpoint, { req: req }).then(function(api) {
    return api.query(""); // An empty query will return all the documents
}).then(function(response) {
    console.log("Documents: ", response.results);
}, function(err) {
    console.log("Something went wrong: ", err);
});

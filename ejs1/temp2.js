let ejs = require('ejs')
let fs = require('fs')

let people = ['geddy', 'neil', 'alex']
let file = fs.readFileSync('./hoge1.ejs', 'utf8')

let html = ejs.render(file, {people: people});


console.log(html)
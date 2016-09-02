const test = require('tape')
const wc = require('./index.js')
const http = require('http')

test('run local file', function(t){
    t.plan(1)
    t.equal(-0, +0)
    wc({}, function(){
        console.log(arguments)
    })
})

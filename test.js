const test = require('tape')
const wc = require('./index.js')
const http = require('http')
const fs = require('fs')
const content = fs.readFileSync('./content.html')
const csp = require('js-csp')
const {go, chan, put, putAsync, takeAsync} = csp
const ch = chan()

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(content)
})

server.listen(0, 'localhost', () => {
    putAsync(ch, 'listening')
})

test('local static server', function(t){
    t.plan(2)
    takeAsync(ch, (str) => {
        const port = server.address().port
        wc({uri: 'http://localhost:'+ port }, function(err, ps){
            t.notOk(err)
            ps.stderr.setEncoding('utf8')
            ps.stderr.on('data', (data) => {
                console.log('err', data);
            });
            t.ok('request received')
            
            setTimeout(() => {
                server.close()
                ps.kill()

                t.end()
            }, 5000)
        })
    })
})

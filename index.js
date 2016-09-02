const wdb = require('win-detect-browsers')
const spawn = require('child_process').spawn
// const start = through2.obj(function(b, _, next){console.log(b); next(); })

function start(executable, opts, cb){
    const env = Object.assign({}, process.env)
    if (opts.display) env.DISPLAY = `:${opts.display}`

    const dataDir = opts.dataDir ||
          `/tmp/${Math.random().toString(16).slice(2)}`
    const args = [
        opts.proxy && `--proxy-server=${opts.proxy}`,
        `--user-data-dir=${dataDir}`,
          '--disable-restore-session-state',
          '--no-default-browser-check',
          '--start-maximized',
          '--disable-default-apps',
          '--disable-sync',
          '--enable-fixed-layout',
          '--no-first-run',
          '--noerrdialogs',
          opts.uri
    ].filter(Boolean)

    cb(spawn(executable, args, { env }))
}

function test(opts, cb){

    wdb(['chrome'], {version: false}, function(found){
        if ( Array.isArray(found) && found.length > 0 ) {
            found.some(function(f){
                try {
                    console.log('trying path:', f.path)
                    start(f.path, opts, cb)
                } catch (e) {
                    console.error('failed: ', f.path)
                    return false
                }
            })
        }
    })
}

module.exports = (opts, cb) => {
    test(opts, cb)
}

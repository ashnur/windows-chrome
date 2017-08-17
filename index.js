const os = require('os')
const env = Object.assign({}, process.env)
const DEBUG = env.DEBUG || true
const wdb = require('win-detect-browsers')
const spawn = require('child_process').spawn
// const start = through2.obj(function(b, _, next){console.log(b); next(); })

function start(executable, opts, cb){
    if (opts.display) env.DISPLAY = `:${opts.display}`

    const dataDir = opts.dataDir ||
          `${os.tmpdir()}\\${Math.random().toString(16).slice(2)}`

    const args = [ opts.proxy && `--proxy-server=${opts.proxy}`
                , `--user-data-dir=${dataDir}`
	    	    , '--no-sandbox',
                , '--disable-restore-session-state'
                , '--no-default-browser-check'
                , '--start-maximized'
                , '--disable-default-apps'
                , '--disable-sync'
                , '--enable-fixed-layout'
                , '--no-first-run'
                , '--noerrdialogs'
                , '--headless'
                , '--disable-gpu'
	            , '--remote-debugging-port=9222' 
                , opts.uri
                ].filter(Boolean)

	console.log(args)

    cb(null, spawn(executable, args, { env }))
}

function test(opts, cb){

    wdb(['chrome'], {version: false}, function(found){
        if ( Array.isArray(found) && found.length > 0 ) {
            found.some(function(f){
                try {
                    if ( DEBUG ) console.log('trying path:', f.path)
                    start(f.path, opts, cb)
                    return true
                } catch (e) {
                    if ( DEBUG ) {
                        console.error('failed: ', f.path)
                        console.error(e)
                    }
                    return false
                }
            })
        }
    })
}

module.exports = (opts, cb) => {
    test(opts, cb)
}

# windows-chrome

Uses [win-detect-browsers](https://npm.im/win-detect-browsers)

# Usage

```js
const chrome = require('windows-chrome')

chrome({ uri: 'https://github.com/' }, function(err, ps){
	ps.stderr.setEncoding('utf8')
        ps.stderr.on('data', (data) => {
        	console.log('err', data);
        });
	
	// ... 
})
```

## Installation

```js
$ npm install windows-chrome
```

Google Chrome needs to be installed on your system as well.

## API

### chrome(opts, callback)

Callback is called with `err` and `child_process` objects. 

Options:

- `uri`: Open this at start
- `proxy`: Proxy server settings
- `dataDir`: Data dir, defaults to your systems' TMP

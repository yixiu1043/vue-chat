require('./check-versions')()

process.env.NODE_ENV = 'production'
var express = require('express')
var server = express()

var apiServerApp = require('./api-server')


//啟動api server
apiServerApp.listen(6869)
server.use('/',express.static(__dirname + '/../dist'));
server.listen(6868);

console.log('Server running on 6868...')
console.log('api server running on 6869...')

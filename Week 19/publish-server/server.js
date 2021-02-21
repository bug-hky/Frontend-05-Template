let http = require('http')
let unzipper = require('unzipper')


http.createServer(function(request, response) {
    console.info('request', request.headers)
    
    // let outFile = fs.createWriteStream('../server/public/tmp.zip')
    // request.pipe(outFile)

    request.pipe(unzipper.Extract({ path: '../server/public/' }))
}).listen(8082)

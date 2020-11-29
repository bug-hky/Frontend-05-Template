const http = require('http')

http.createServer((request, response) => {
    let body = []
    request.on('error', (err) => {
        console.error(err)
    }).on('data', (chunk) => {
        console.info('chunk', chunk)
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString()
        console.info('body', body)
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.end('Hello Panther welcome to server\n')
    })
}).listen(8088)

console.info('server started')
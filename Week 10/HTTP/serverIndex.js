const http = require('http')

http.createServer((request, response) => {
    let body = []
    // request.on('error', (err) => {
    //     console.error(err)
    // }).on('data', (chunk) => {
    //     console.info('chunk', chunk)
    //     body.push(chunk)
    // }).on('end', () => {
    //     body = Buffer.concat(body).toString()
    //     console.info('body', body)
    //     response.writeHead(200, {'Content-Type': 'text/html'})
    //     response.end('Hello Panther welcome to server\n')
    // })
    console.info('request received')
    console.info(request.headers)
    response.setHeader('Content-Type', 'text/html')
    response.setHeader('X-Foo', 'bar')
    response.writeHead(200, {'Content-Type': 'text/plain'})
    response.end(
`<html>
    <head>
        <style>
            .package {
                display: block;
                padding: 300px;
            }
            div {
                box-sizing: border-box;
            }
            .border {
                border: 1px solid skyblue;
            }
            .area {
                background-color: #CCCCCC;
            }
        </style>
    </head>
    <body>
        <div class="package">
            <div class="top-area border area"></div>
            <div>
                <div class="front-area border area"></div>
                <div class="right-area border area"></div>
            </div>
        </div>
    </body>
</html>`
)
}).listen(8088)

console.info('server started')
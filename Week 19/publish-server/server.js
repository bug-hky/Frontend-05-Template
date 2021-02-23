let http = require('http')
let https = require('https')
let unzipper = require('unzipper')
let querystring = require('querystring')

// 2. 在publish-server中的auth路由下：接收code，使用code+client_id+client_secret换token
function auth (request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1])
    getToken(query.code, info => {
        console.info(info)
        // response.write(JSON.stringify(info))
        response.write(`<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`)
        response.end()
    })
    // console.info(query)
}

function getToken (code, cb) {
    let request = https.request({
        hostname: 'github.com',
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.cc3912ed18bb926d&client_secret=787a69db33c7ea0a5749c5a9aa4926c3f1266f6b`,
        port: 443,
        method: 'POST'
    }, response => {
        body = ''
        response.on('data', chunk => {
            body += (chunk.toString())
        })
        response.on('end', chunk => {
            cb(querystring.parse(body))
        })
    })

    request.end()
}
// 4. 在publish-server中的publish路由： 用token获取用户信息，检查权限，接受发布
function publish (request, response) {
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1])
    getUser(query.token, userInfo => {
        console.info('userInfo', userInfo)
        if (userInfo.login === 'bug-hky') {
            response.write(JSON.stringify(userInfo))
            // let outFile = fs.createWriteStream('../server/public/tmp.zip')
            // request.pipe(outFile)
            request.pipe(unzipper.Extract({ path: '../server/public/' }))
            request.on('end', () => {
                response.end('success!!!')
            })
        }
    })
}

function getUser (token, cb) {
    let request = https.request({
        hostname: 'api.github.com',
        path: `/user`,
        port: 443,
        method: 'GET',
        headers: {
            Authorization: `token ${token}`,
            "User-Agent": 'example-publish'
        }
    }, response => {
        let body = ''
        response.on('data', chunk => {
            body += (chunk.toString())
        })
        response.on('end', chunk => {
            cb(JSON.parse(body))
        })
    })

    request.end()
}

http.createServer(function(request, response) {
    console.info('request', request.headers)
    if (request.url.match(/^\/auth\?/)) {
        auth(request, response)
    } else if (request.url.match(/^\/publish\?/)) {
        publish(request, response)
    }
}).listen(8082)

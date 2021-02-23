let http = require('http')
let fs = require('fs')
let archiver = require('archiver')
let child_process = require('child_process')
let querystring = require('querystring')

// 1. 打开https://github.com/login/oauth/authorize
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.cc3912ed18bb926d`)


// 3. 在publish-tool中创建server，接收token，点击发布
http.createServer(function(request, response) {
    let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1])
    publish(query.token)
}).listen(8083)


function publish (token) {
    let request = http.request({
        postname: '127.0.0.1',
        port: 8082, // 8882
        method: 'POST',
        path: `/publish?token=${token}`,
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    }, response => {
        console.info('>>>????', response)
    })

    const archive = archiver('zip', {
        zlib: { level: 9 } //Sets the compression level
    })
    
    archive.directory('./sample/', false)
    
    archive.finalize()
    
    archive.pipe(request)
}

/*
let request = http.request({
    postname: '127.0.0.1',
    port: 8082, // 8882
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream'
    }
}, response => {
    console.info(response)
})


const archive = archiver('zip', {
    zlib: { level: 9 } //Sets the compression level
})

archive.directory('./sample/', false)

// 已经填充好内容
archive.finalize()

// archive.pipe(fs.createWriteStream("tmp.zip"))
archive.pipe(request)

*/
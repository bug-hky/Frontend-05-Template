let http = require('http')
let fs = require('fs')
let archiver = require('archiver')

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
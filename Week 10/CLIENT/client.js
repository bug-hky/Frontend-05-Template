const images = require('images')
const net = require('net')
const parser = require('./parser.js')
const render = require('./render.js')

// 一.HTTP请求
// 设计一个HTTP请求的类
// content type 是一个必要字段，要有默认值
// body是KV格式
// 不同的content-type影响body的格式

// 二.send函数编写
// Request构造器中收集必要的信息
// 设计一个send函数，把请求真实的发送到服务器
// send函数应该是异步的

class Request {
    constructor (options) {
        this.method = options.method || 'GET'
        this.port = options.port || '80'
        this.host = options.host
        this.path = options.path || '/'
        this.body = options.body || {}
        this.headers = options.headers || {}
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }

        if (this.headers['Content-Type'] === 'application/json')
            this.bodyText = JSON.stringify(this.body)
        else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded')
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')

        this.headers['Content-Length'] = this.bodyText.length
    }

    toString () {
       return `${this.method} ${this.path} HTTP/1.1\r
       ${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
       \n
       ${this.bodyText}`
    }

    // 三.send发送请求共分三步
    // 1.设计支持已有的connection或者自己新建connection
    // 2.收到的数据传给parser
    // 3.根据parser的状态resolve Promise
    send (connection) {
        return new Promise((resolve, reject) => {
            // ...
            const parser = new ResponseParser
            // 接受一个connection参数， 如果有参数则直接写入内容，
            // 如果没有connection则创建一个新的TCP连接再异步写入内容
            console.info('has connection', connection)
            if (connection) {
                connection.write(this.toString())
            } else {
                connection = net.createConnection({
                    // 构造函的内容
                    host: this.host,
                    port: this.port
                }, (e) => {
                    console.info('connection', e)
                    connection.write(this.toString())
                })
            }

            connection.on('data', (data) => {
                console.info('response data', data.toString())
                parser.receive(data.toString())
                if (parser.isFinished) {
                    resolve(parser.response)
                    connection.end()
                }
            })

            connection.on('error', (err) => {
                reject(err)
                connection.end()
            })
            resolve('')
        })
    }
 }

/*
*
* HTTP协议是一个文本型协议，与二进制协议相对，内容全是字符串，使用Unicode || ASCII编码
* REQUEST格式: ________________________________________________________________
* POST/HTTP/1.1                                     -- request line (methods path 协议/版本号)
* Host: 127.0.0.1                                   -- headers
* Content-Type: application/x-www-from-urlencoded   -- headers
*                                                   -- space line
* field1=aaa&code=x#3D1                             -- body (格式由Content-Type决定，一般来说是KV形式)
*
* RESPONSE格式: _______________________________________________________________
* HTTP/1,1 200 OK                                   -- status line (协议/版本号 http状态码 http状态文本)
* Content-Type: text/html                           -- headers
* Date: Mon,23 Dec 2019 06:46:19 GMT                -- headers
* Connection: keep-alive                            -- headers
* Transfer-Encoding: chunked                        -- headers
*                                                   -- space line
* 26                                                -- body (格式由Content-Type决定)
* <html><body>body content<body><html>              -- body (node默认返回的body格式是chunked body => 16进制的数字开头单独一行，以16进制的0结尾单独一行)
* 0                                                 -- body
* */
//
//
// 四.ResponseParser
// 1. Response必须分段构造，所以我们要用一个ResponseParser来"装配"
// 2. ResponseParser分段主力ResponseText, 我们用状态机来分析文本的结构
//
 class ResponseParser {
    constructor () {
        this.WAITING_STATUS_LINE = 0
        this.WAITING_STATUS_LINE_END = 1
        this.WAITING_HEADER_NAME = 2
        this.WAITING_HEADER_SPACE = 3
        this.WAITING_HEADER_VALUE = 4
        this.WAITING_HEADER_LINE_END = 5
        this.WAITING_HEADER_BLOCK_END = 6
        this.WAITING_BODY = 7

        this.current = this.WAITING_STATUS_LINE
        this.statusLine = ''
        this.headers = {}
        this.headerName = ''
        this.headerValue = ''
        this.bodyParser = null
    }
    get isFinished () {
        return this.bodyParser && this.bodyParser.isFinished
    }
    get response () {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    receive (string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i))
        }
    }
    receiveChar (char) {
        console.info('char', char)
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END
            } else {
                this.statusLine += char
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE
            } else if (char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END
                if (this.headers['Transfer-Encoding'] === 'chunked')
                    this.bodyParser = new TrunkedBodyParser()
            } else {
                this.headerName += char
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END
                this.headers[this.headerName] = this.headerValue
                this.headerName = ''
                this.headerValue = ''
            } else {
                this.headerValue += char
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY
            }
        } else if (this.current === this.WAITING_BODY) {
            console.info('waiting-body', char)
            this.bodyParser.receiveChar(char)
        }
    }
 }

 /*
 * 五.BodyParser
 * 1.Response的body可能根据Content-Type有不同的结构，因此我们会采用子Parser的结构来解决问题
 * 2.以TrunkedBodyParser为例，使用状态及来处理body的格式
 * */
 class TrunkedBodyParser {
     constructor () {
         this.WAITING_LENGTH = 0
         this.WAITING_LENGTH_LINE_END =1
         this.READING_TRUNK = 2
         this.WAITING_NEW_LINE = 3
         this.WAITING_NEW_LINE_END = 4
         this.length = 0
         this.content = []
         this.isFinished = false
         this.current = this.WAITING_LENGTH
     }
     receiveChar (char) {
         if (this.current === this.WAITING_LNEGTH) {
             if (char === '\r') {
                 if (this.length === 0) {
                     this.isFinished = true
                 }
                 this.current = this.WAITING_LENGTH_LINE_END
             } else {
                 this.length *= 16
                 this.length += parseInt(char, 16)
             }
         } else if (this.current === this.WAITING_LENGTH_LINE_END) {
             if (char === '\n') this.current = this.READING_TRUNK
         } else if (this.current === this.READING_TRUNK) {
             if (this.isFinished) return
             this.content.push(char)
             this.length --
             if (this.length === 0) {
                 this.current = this.WAITING_NEW_LINE
             }
         } else if (this.current === this.WAITING_NEW_LINE) {
             if (char === '\r') this.current = this.WAITING_NEW_LINE_END
         } else if (this.current === this.WAITING_NEW_LINE_END) {
             if (char === '\n') this.current = this.WAITING_LNEGTH
         }
     }
 }

// 使用立即执行的函数表达式时，可以利用void运算符让JS引擎把function关键字识别成函数表达式而不是语句。
async function rqs () {
    let request = new Request({
        method: 'POST', // http协议
        host: '127.0.0.1', // IP层
        port: '8088', // TCP层
        path: '/', // http协议
        headers: {
            ['X-Foo2']: 'customed'
        },
        body: {
            name: 'panther'
        }
    })

    console.info('request', request)

    let response = await request.send()
    console.info(response)

    let dom = parser.parseHTML(response.body)
    console.info(dom)

    let viewport = images(800, 600)
    
    // 绘制单个元素
    //                   html        body        ...         ...
    // render(viewport, dom.children[0].children[3].children[1].children[3])

    // 绘制dom树
    render(viewport, dom)

    viewport.save('viewport.jpg')
}

rqs()
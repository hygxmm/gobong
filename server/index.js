const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const app = new Koa()
app.use(static(path.join(__dirname,'./../dist')))

const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
const users = new Map();
//客户端连接上的事件
io.on('connection',(socket) => {
    console.log("客户端连接上啦~~")
    users.set(socket.id,socket)
    // socket.emit('system',{id: socket.id,message: '链接成功'})
    // socketFn(io,socket,users)
})

//客户端断开连接
io.on('disconnect', (socket) => {
    console.log("客户端断开连接啦~~")
    // Socket.remove({id: socket.socket.id})
    users.delete(socket.id)
})

//监听启动端口
server.listen(7777, () => {
    console.info(`服务启动成功 http://localhost:7777`)
})

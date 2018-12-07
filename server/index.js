const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const app = new Koa();

app.use(static(path.join(__dirname,'./../dist')));

const server = require('http').Server(app.callback());
const io = require('socket.io')(server);

const online = new Map();//在线用户
const rooms = new Map();//房间列表

//创建默认房间



//客户端连接上的事件
io.on('connection',(socket) => {
    console.log("客户端连接上啦~~");
    // socket.emit('system',{id: socket.id,message: '链接成功'})
    // socketFn(io,socket,users)
    socket.on('login',(data) => {
        const arr = Array.from(online.values()).filter(item => item.name === data);
        if(arr.length !== 0){
            socket.emit('login',{
                code: 300,
                message: '昵称重复'
            })
        }else{
            socket.name = data;
            online.set(socket.id,socket);
            socket.emit('login',{
                code: 200,
                message: '登录成功',
            });
            io.emit('updateOnline',Array.from(online.values()).map(item => {
                return {
                    id: item.id,
                    name: item.name
                }
            }))
        }
    });

    socket.on('battle',(data) => {
        joinRoom(socket,createRoomName());
        socket.emit('battle',{
            code: 200,
            message: '开始对战吧'
        });

        const skt = online.get(data);
        skt.emit('game',);
        skt.on('game',);
    })
});


//加入房间
function joinRoom(socket,room){
    socket.join(room);
    socket.broadcast.to(room).emit('message',{
        text:'啊啊啊啊啊'
    });
    const userInRoom = io.sockets.clients(room)


}
//生成随机房间名
function createRoomName(){
    return Math.random().toString(32).substr(2)
}

//客户端断开连接
io.on('disconnect', (socket) => {
    console.log("客户端断开连接啦~~");
    online.delete(socket.id)
});

io.on('close', (socket) => {
    console.log("客户端断开连接啦~~");
    online.delete(socket.id)
});

//监听启动端口
server.listen(7777, () => {
    console.info(`服务启动成功 http://192.168.1.105:7777`)
});

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
rooms.set('default',[]);

//客户端连接上的事件
io.on('connection',(socket) => {
    console.log("客户端连接上啦~~~");
    socket.emit('auto',{username: socket.name});
    socket.on('login',(data) => {
        const arr = Array.from(online.values()).filter(item => item.name === data);
        if(arr.length !== 0){
            socket.emit('login',{
                type: 'error',
                message: '昵称重复'
            })
        }else{
            socket.name = data;
            online.set(socket.id,socket);
            socket.emit('login',{
                type: 'success',
                message: '登录成功',
            });
            socket.join('defaultRoom',() => {
                //给全体用户发
                io.sockets.in('defaultRoom').emit('info',{
                    type: 'system',
                    message: `${socket.name} 上线啦~~`
                })
            })
        }
    });
    socket.on('battle',(data) => {
        joinRoom(socket,createRoomName());
        socket.emit('battle',{
            code: 200,
            message: '开始对战吧'
        });
    });
    socket.on('message',(data) => {
        socket.broadcast.emit('message',{
            type: data.type,
            status: data.status,
            user: socket.name,
            message: data.message
        });
    });
    socket.on('info',(data) => {
        //给房间内除自己的其他人发
        socket.broadcast.to('defaultRoom').emit('info',{
            type: 'other',
            user: socket.name,
            message: data.message,
        });
        socket.emit('info',{
            type: 'my',
            user: socket.name,
            message: data.message,
        })
    });

    //客户端断开连接
    socket.on('disconnect', () => {
        socket.leave('defaultRoom');
        online.delete(socket.id)
    });
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
//监听启动端口
server.listen(7777, () => {
    console.info(`服务启动成功 http://192.168.1.105:7777`)
});

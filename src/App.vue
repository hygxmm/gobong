<template>
    <div id="app">
        <div class="login" v-if="!login">
            <div class="name">
                <input type="text" v-model="username" placeholder="请输入昵称" />
                <button @click="handleLogin" :disabled="disabled">进入</button>
            </div>
        </div>
        <div class="list" v-if="login">
            <ul>
                <li v-for="item in lists" :key="item.id">
                    <span>{{item.name}}</span>
                    <button v-if="item.name !== username" @click="invitBattle(item)">对战</button>
                </li>
            </ul>
        </div>
        <div class="" v-if="login && begin">
            <Board />
        </div>
        <div class="chats" v-if="login">
            <Chat />
        </div>
    </div>
</template>
<!--https://blog.csdn.net/liuqing_1/article/details/57157227-->

<script>
    import Board from './components/board';
    import Chat from './components/chat';
export default {
    name: "app",
    data() {
        return {
            login: false,
            begin: false,
            username: '',
            disabled: false,
            lists: [],//在线列表
        };
    },
    methods: {
        handleLogin(){
            this.disabled = true;
            if(this.username.trim().length === 0 ){
                alert('请填写昵称')
            }
            this.$io.emit('login',this.username);
            this.$io.on('login',(data) => {
                this.disabled = false;
                if(data.code === 200){
                    this.login = true;
                }else if(data.code === 300){
                    alert('昵称重复');
                    this.username = '';
                }
            });
            this.$io.on('updateOnline',(data) => {
                this.lists = data
            })
        },
        invitBattle(obj){
            this.$io.emit('battle',obj.id);
            this.$io.on('battle',(data) => {
                if(data.code === 200){
                    this

                }
            })
        }
    },
    components: {
        Board,
        Chat
    }
}
</script>

<style>
*{
    margin: 0;
    padding: 0;
}
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}
ul,ol,li{
    list-style: none;
}
#app {
    width: 100%;
    height: 100%;
    background-color: blanchedalmond;
    position: relative;
}
.name {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.name input{
    width: 240px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px #ccc;
    padding: 5px;
    outline: none;
}
.list{
    width: 300px;
    height: 500px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px #ccc;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow: auto;
}
.list ul {
    padding: 0 10px;
}
.list ul li {
    height: 30px;
    border-bottom: 1px solid #ccc;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.charts{
    width: 350px;
    height: 500px;
}


</style>

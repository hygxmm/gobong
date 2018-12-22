<template>
    <div id="app">
        <div class="login" v-if="!login">
            <div class="name">
                <input type="text" v-model="username" placeholder="请输入昵称" />
                <button @click="handleLogin" :disabled="disabled">进入</button>
            </div>
        </div>
        <div class="list" v-if="login">
            <div class="chat-header">{{username}}</div>
            <div class="chat-container">
                <ul class="message-list-wrap">
                    <li v-for="item in lists" :key="item.id" >
                        <!-- 其他人消息 -->
                        <div class="other-message" v-if="item.type == 'other'">
                            <div><span>{{item.user}}</span></div>
                            <div><span>{{item.message}}</span></div>
                        </div>
                        <!-- 自己消息 -->
                        <div class="my-message" v-if="item.type == 'my'">
                            <div class="clearFloat"><span>{{item.user}}</span></div>
                            <div class="clearFloat"><span>{{item.message}}</span></div>
                        </div>
                        <!-- 系统消息 -->
                        <div class="system-message" v-if="item.type == 'system'">
                            <span>{{item.message}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="chat-footer">
                <input type="text" v-model="message" />
                <button @click="sendMessage">发送</button>
            </div>
        </div>
    </div>
</template>
<!--https://blog.csdn.net/liuqing_1/article/details/57157227-->

<script>
export default {
    name: "app",
    data() {
        return {
            login: false,
            begin: false,
            username: '',
            disabled: false,
            lists: [],//消息列表
            message: ''
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
                if(data.type === 'success'){
                    this.login = true;
                    this.$io.name = this.username;
                    sessionStorage.setItem('ld_login','测试登录');
                    this.$parent.username = this.username;
                }else if(data.code === 300){
                    alert('昵称重复');
                    this.username = '';
                }
            });
            this.$io.on('updateOnline',(data) => {
                this.lists = data
            })
        },
        sendMessage(){
            if(this.message.trim().length === 0) return ;
            this.$io.emit('info',{
                message: this.message,
            });
        }
    },
    mounted() {
        if (sessionStorage.getItem('ld_login')) {
            this.login = true
        }
        this.$io.on('info', (data) => {
            console.log(data, "====");
            this.lists.push(data);
        });
    }
}
</script>

<style>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
html,
body {
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
.login{
    width: 100%;
    height: 100%;
    position: relative;
}
.list{
    width: 100%;
    height: 100%;
    position: relative;
}
.name {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.name input{
    width: 240px;
    height: 35px;
    border-radius: 8px;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px #ccc;
    padding: 5px;
    outline: none;
}
.name button{
    width: 240px;
    height: 30px;
    margin-top: 20px;
    border: none;
    border-radius: 5px;
    background-color: brown;
    color: #fff;
}
.chat-header{
    width: 100%;
    height: 45px;
    background-color: dodgerblue;
    position: absolute;
    top: 0;
    color: #fff;
    text-align: center;
    line-height: 45px;
}
.chat-container{
    width: 100%;
    position: absolute;
    top: 45px;
    bottom: 48px;
    background-color: white;
    padding: 0 10px;
    overflow: auto;
}
.chat-footer{
    width: 100%;
    height: 48px;
    background-color: indianred;
    position: absolute;
    bottom: 0;
    display: flex;
}
.chat-footer input {
    width: 80%;
    padding: 5px;
    outline: none;
}
.chat-footer button {
    width: 20%;
}
.other-message{
    font-size: 12px;
    margin-bottom: 10px;
}
.other-message > div:nth-child(1) span{
    display: inline-block;
    padding: 2px 10px;
    border-radius: 5px 5px 0 0;
    background-color: blanchedalmond;

}
.other-message > div:nth-child(2) span{
    display: inline-block;
    background-color: #f0f;
    padding: 5px 10px;
    max-width: 80%;
    border-radius: 0 3px 3px 3px;
    color: #fff;
}
.my-message{
    font-size: 12px;
    margin-bottom: 10px;
}
.my-message > div:nth-child(1) span{
    display: inline-block;
    padding: 2px 10px;
    border-radius: 5px 5px 0 0;
    background-color: blanchedalmond;
    float: right;
}
.my-message > div:nth-child(2) span{
    display: inline-block;
    background-color: #f0f;
    padding: 5px 10px;
    max-width: 80%;
    border-radius: 0 3px 3px 3px;
    color: #fff;
    float: right;
}
.system-message{
    margin-bottom: 10px;
    font-size: 12px;
    display: flex;
    justify-content: center;
}
.system-message span{
    border-radius: 20px;
    background-color: #dedede;
    padding: 2px 10px;
    max-width: 80%;
}
.clearFloat{
    zoom: 1;
}
.clearFloat::after{
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
</style>

<template>
    <div class="chat">
        <div>
            <ul class="messages">
                <li v-for="(item,index) in messages" :key="index">
                    <span>{{item.user}}</span>
                    <span>{{item.message}}</span>
                </li>
            </ul>
            <input v-model="info" type="text">
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "chat",
        data(){
            return {
                messages: [],
                info: ''
            }
        },
        methods: {
            sendMessage(){
                if(this.info.trim() === '') return ;
                this.$io.emit('message',{
                    type: 'text',
                    status: 'other',
                    message: this.info
                });
                this.messages.push({
                    type: 'text',
                    user: this.$root.username,
                    status: 'my',
                    message: this.info
                });
                this.info = '';
                this.$io.on('message',(data) => {
                    this.messages.push(data);
                });
                this.$io.on('system',(data) => {

                })
            }
        }
    }
</script>

<style scoped>
.chat{
    position: absolute;
    top: 20px;
    left: 10px;
    padding: 10px;
}
.messages{
    width: 300px;
    background-color: white;
    border-radius: 5px;

}
.messages li{
    font-size: 12px;
    padding: 10px 0;
}
</style>

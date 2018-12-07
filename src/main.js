import Vue from 'vue'
import App from './App'
import socket from 'socket.io-client'

Vue.prototype.$io = socket('http://localhost:7777');

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
});

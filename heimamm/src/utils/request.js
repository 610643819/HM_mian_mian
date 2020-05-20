import axios from 'axios';
import Vue from 'vue';


axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
// axios跨域携带cookie
axios.defaults.withCredentials = true;

// 请拦截器，设置请求头
axios.interceptors.request.use(function(config){
    const token = localStorage.getItem('token')
    // 这里的用户信息请求的参数名是token，所以headers.token
    token?config.headers.token = token:''
    return config
},function(error){
    return Promise.reject(error)
})


Vue.prototype.$axios = axios;
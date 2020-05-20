import Vue from "vue";
import VueRouter from "vue-router";


import Login from "@/views/login";
import Layout from "@/views/layout";

Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/layout", component: Layout },
  ],
});

router.beforeEach((to, from, next) => {
  if(to.fullPath == '/login'){
    next()
  }else{
    // 查看有么有token
    let token =localStorage.getItem('token')
    if(token){
      next()
    }else{
      // 没有token就去登录页面
      next('/login')
    }
  }
})


export default router;

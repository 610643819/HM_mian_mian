import Vue from "vue";
import VueRouter from "vue-router";


import Login from "@/views/login";
import Layout from "@/views/layout";
import Chart from "@/views/layout/chart"
import Enterprise from "@/views/layout/enterprise"
import Question from "@/views/layout/question"
import Subject from "@/views/layout/subject"
import User from "@/views/layout/user"



Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/layout",component: Layout,children:[
      {path:"/",component:Chart},
      {path:"chart",component:Chart},
      {path:"enterprise",component:Enterprise},
      {path:"question",component:Question},
      {path:"subject",component:Subject},
      {path:"user",component:User},
    ]},
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

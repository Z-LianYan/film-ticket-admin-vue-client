import Vue from 'vue'
// import VueRouter from 'vue-router'
// Vue.use(VueRouter)
Vue.use(VueRouter)//注册路由

import Login from '@/views/system/login';
import Error_404 from '@/views/system/404';

import Calendar from '@/views/calendar';



export const constantRoutes = [
  {
    path: '/redirect',
    component: ()=>import("@/layout"),
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/system/redirect/index'),
        // meta:{
        //   title: '',
        //   icon: '',
        //   breadcrumb: [{//解决右键历史菜单刷新报错（面包屑 Breadcrumb组件路由监听 ）
        //     name:'Redirect',
        //     path: '/redirect',
        //     title: ''
        //   }]
        // },
      }
    ]
  },
  { path: '/login',name:"login", component: Login, hidden: true },
  { path: '/404',name:"error_404", component: Error_404, hidden: true },
  // {
  //   path: '/',component: ()=>import("@/layout"), redirect: '/dashboard', children: [
  //     { 
  //       path: 'dashboard', 
  //       name: 'Dashboard', 
  //       hidden: false,
  //       component: resolve => require(["@/views/dashboard/index"],resolve), 
  //       meta: { 
  //         title: '首页', 
  //         icon: 'el-icon-s-home',
  //         affix:true,
  //         activeMenu: '/dashboard',
  //         breadcrumb:[{
  //           name: "Dashboard",
  //           path: "/dashboard",
  //           redirect: "/dashboard",
  //           title: "首页"
  //         }]
  //       }
  //     }
  //   ]
  // }
]

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

router.selfaddRoutes = function (params){
  router.matcher = new VueRouter().matcher;
  router.addRoutes(params)
}


export default router

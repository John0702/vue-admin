import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history', // 去掉url中的#
  routes: [
    {
      path: '/',
      redirect: '/login' // 重定向到登录页面
    },
    {
      path: '/login',
      name: 'login',
      // 路由懒加载
      component: () => import('@/view/Login.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/view/Home.vue'),
      meta: {
        title: '首页'
      },
    },
  ]
})

// 挂载路由导航守卫，to表示将要访问的路径，from表示从哪个路径跳转而来，next是一个函数，表示放行
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 放行登录页面
  if (to.path === '/login') return next()
  // 校验token
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router;
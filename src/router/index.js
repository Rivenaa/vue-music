import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: () =>
      import('@/views/recommend' /* webpackChunkName: "recommend" */),
    children: [
      {
        path: '/album/:id',
        component: () => import('@/views/album' /* webpackChunkName: "album" */)
      }
    ]
  },
  {
    path: '/search',
    component: () => import('@/views/search' /* webpackChunkName: "search" */)
  },
  {
    path: '/singer',
    component: () => import('@/views/singer' /* webpackChunkName: "singer" */),
    children: [
      {
        path: '/singer-detail/:mid',
        component: () =>
          import(
            '@/views/singer-detail' /* webpackChunkName: "singer-detail" */
          )
      }
    ]
  },
  {
    path: '/top-list',
    component: () =>
      import('@/views/top-list' /* webpackChunkName: "top-list" */),
    children: [
      {
        path: '/top-detail/:id',
        component: () =>
          import('@/views/top-detail' /* webpackChunkName: "top-detail" */)
      }
    ]
  },
  {
    path: '/user-center',
    components: {
      user: () =>
        import('@/views/user-center' /* webpackChunkName: "user-center" */)
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

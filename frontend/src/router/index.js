export const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
  },
  {
    path: '/trading/:brokerId',
    name: 'Trading',
    component: () => import('../views/TradingView.vue'),
    props: true,
  },
  // Fallback route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
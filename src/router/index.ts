import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
        meta: {
          title: '天使动漫论坛',
        },
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Login/index.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: 'forum/:gid',
        name: 'Forum',
        component: () => import('@/views/Forum/index.vue'),
        meta: {
          title: '分区',
        },
      },
      {
        path: 'forumview/:fid',
        name: 'ForumView',
        component: () => import('@/views/ForumView/index.vue'),
        meta: {
          title: '板块详情',
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

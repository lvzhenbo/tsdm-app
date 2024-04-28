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
        path: 'userInfo',
        name: 'UserInfo',
        component: () => import('@/views/UserInfo/index.vue'),
        meta: {
          title: '我的资料',
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
      {
        path: 'thread/:tid',
        name: 'Thread',
        component: () => import('@/views/Thread/index.vue'),
        meta: {
          title: '帖子详情',
        },
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/Search/index.vue'),
        meta: {
          title: '搜索',
        },
      },
      // {
      //   path: 'message',
      //   name: 'Message',
      //   component: () => import('@/views/Message/index.vue'),
      //   meta: {
      //     title: '消息',
      //   },
      // },
      // {
      //   path: 'messageDetail/:id',
      //   name: 'MessageDetail',
      //   component: () => import('@/views/MessageDetail/index.vue'),
      //   meta: {
      //     title: '消息详情',
      //   },
      // },
      // {
      //   path: 'messageAdd/:id',
      //   name: 'MessageAdd',
      //   component: () => import('@/views/MessageAdd/index.vue'),
      //   meta: {
      //     title: '回复消息',
      //   },
      // },
    ],
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/index.vue'),
    meta: {
      title: '设置',
    },
  },
  {
    path: '/otherUserInfo/:username',
    name: 'OtherUserInfo',
    component: () => import('@/views/OtherUserInfo/index.vue'),
    meta: {
      title: '个人资料',
    },
  },
  {
    path: '/threadAdd',
    name: 'ThreadAdd',
    component: () => import('@/views/Thread/add.vue'),
    meta: {
      title: '发表帖子',
    },
  },
  {
    path: '/notification',
    name: 'Notification',
    component: () => import('@/views/Notification/index.vue'),
    meta: {
      title: '通知',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

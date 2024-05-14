import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {requiresAuth: true},
    children: [
      //    Main
      { path: '', component: () => import('src/modules/main/dashboard.vue') },
      //    Bills
      { path: 'account-number', component: () => import('../modules/bills/account-number.vue') },
      { path: 'report/:id', component: () => import('../modules/bills/report.vue') },
      { path: 'bills/:id', component: () => import('../modules/bills/bills.vue') },
      //    Management
      { path: 'houses', component: () => import('../modules/management/homes.vue') },
      { path: 'persons', component: () => import('../modules/management/persons.vue') },
      { path: 'users', component: () => import('../modules/management/users.vue') },
      { path: 'roles', component: () => import('../modules/management/roles.vue') },
      //    References
      { path: 'communal-type', component: () => import('../modules/references/communal-type.vue') },
      { path: 'region', component: () => import('../modules/references/region.vue') }
    ]
  },

  // Login
  {
    path: '/auth/login',
    component: () => import('pages/login.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;

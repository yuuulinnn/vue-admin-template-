import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
 {
	path: '/consulting',
	component: Layout,
	redirect: '/consulting/index',
	name: 'consulting',
	meta: {
		title: 'Consulting',
		icon: 'consulting'
	},
	children: [
		{ path: 'index', component: ()=>import('@/views/consulting/index'), name: 'List', meta: { title: 'List' }},
		{
			path: 'list/detail/:id(\\d+)',
			component: () => import('@/views/consulting/formlist/detail'),
			name: 'Detail',
			meta: { title: 'Detail', noCache: true },
			hidden: true
		},
		{
			path: 'recycle/detail/:id(\\d+)',
			component: () => import('@/views/consulting/formlist/detail'),
			name: 'recycleDetail',
			meta: { title: 'Detail', noCache: true },
			hidden: true
		},
		{ path: 'recycle', component: ()=>import('@/views/consulting/recycle'), name: 'Recycle', meta: { title: 'Recycle' }},
		{ path: 'set', component: ()=>import('@/views/consulting/set'), name: 'Set', meta: { title: 'Set' }}
	]
  },
 {
	path: '/article',
	component: Layout,
	redirect: '/article/index',
	name: 'article',
	meta: {
		title: 'Article',
		icon: 'article'
	},
	children: [
		{ path: 'index', component: ()=>import('@/views/article/index'), name: 'List', meta: { title: 'List' }},
		{
			path: 'list/detail/:id(\\d+)',
			component: () => import('@/views/article/detail'),
			name: 'Detail',
			meta: { title: 'Detail', noCache: true },
			hidden: true
		},
		{
			path: 'recycle/detail/:id(\\d+)',
			component: () => import('@/views/article/detail'),
			name: 'recycleDetail',
			meta: { title: 'Detail', noCache: true },
			hidden: true
		},
		{ path: 'recycle', component: ()=>import('@/views/article/recycle'), name: 'Recycle', meta: { title: 'Recycle' }},
		{ path: 'set', component: ()=>import('@/views/article/set'), name: 'Set', meta: { title: 'Set' }}
	]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

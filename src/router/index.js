import Vue from 'vue'
import VueRouter from 'vue-router'

const Recommend = () => import('../views/recommend/Recommend')
const Singer = () => import('../views/singer/Singer')
const Rank = () => import('../views/rank/Rank')
const Search = () => import('../views/search/Search')
const SingerDetail = () => import('../views/singer/childComps/SingerDetail')
const RecommendSongDetail = () =>
  import('../views/recommend/childComps/RecommendSongDetail')
const RankDetail = () => import('../views/rank/childComps/RankDetail')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: RecommendSongDetail,
      },
    ],
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail,
      },
    ],
  },
  {
    path: '/rank',
    component: Rank,
    children: [
      {
        path: ':id',
        component: RankDetail,
      },
    ],
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail,
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router

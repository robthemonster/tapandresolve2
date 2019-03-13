import Vue from 'vue'
import TapAndResolve from './TapAndResolve.vue'
import VueRouter from 'vue-router'
import DrawCardPage from './page_components/DrawCardPage'
import AboutPage from "./page_components/AboutPage.vue"
import DislikedCardsPage from "./page_components/DislikedCardsPage.vue"
import LeaderboardsPage from "./page_components/LeaderboardsPage.vue"
import LikedCardsPage from "./page_components/LikedCardsPage.vue"
import SearchPage from "./page_components/SearchPage.vue"
const routes = [
    {path: '/', component: DrawCardPage},
    {path: '/liked', component: LikedCardsPage},
    {path: '/disliked', component: DislikedCardsPage},
    {path: "/search", component: SearchPage},
    {path: '/leaderboards', component: LeaderboardsPage},
    {path: "/about", component: AboutPage}
];
const router = new VueRouter({
    routes
});
Vue.config.productionTip = false;
Vue.use(VueRouter);

 new Vue({
    render: h => h(TapAndResolve),
    router
}).$mount('#app');
import Vue from 'vue'
import TapAndResolve from './TapAndResolve.vue'
import VueRouter from 'vue-router'
import DrawCardPage from './page_components/DrawCardPage'
import AboutPage from "./page_components/AboutPage.vue"
import LeaderboardsPage from "./page_components/LeaderboardsPage.vue"
import SearchPage from "./page_components/SearchPage.vue"
import TableCardsPage from "@/page_components/TableCardsPage";

const routes = [
    {path: '/', component: DrawCardPage},
    {path: '/liked', component: TableCardsPage, props: {apiPath: '/getLiked'}},
    {path: '/disliked', component: TableCardsPage, props: {apiPath: '/getBlocked'}},
    {path: "/search", component: SearchPage},
    {path: '/leaderboards', component: LeaderboardsPage},
    {path: "/about", component: AboutPage}
];
const router = new VueRouter({
    mode: 'history',
    routes
});
Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
    render: h => h(TapAndResolve),
    router
}).$mount('#app');
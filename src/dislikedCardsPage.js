import Vue from 'vue'
import App from './page_components/DislikedCardsPage.vue'


Vue.config.productionTip = false;

const app = new Vue({
    render: h => h(App),
}).$mount('#app');


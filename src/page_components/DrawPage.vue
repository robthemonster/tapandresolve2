<template>
    <div id="app" class="text-white bg-dark">
        <NavBar v-on:logout="logout" v-on:login="login" :selfRef="selfRef" :loggedIn="loggedIn"></NavBar>
        <DrawCard :loggedIn="loggedIn"></DrawCard>
        <Footer></Footer>
    </div>
</template>

<script>
    import Vue from 'vue'
    import BootstrapVue from 'bootstrap-vue'
    import Octicon from 'vue-octicon/components/Octicon.vue'
    import 'vue-octicon/icons';
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import VueCookies from 'vue-cookies'
    import DrawCard from '../components/draw_page_components/DrawCard.vue'
    import NavBar from "../components/NavBar.vue"
    import Footer from "../components/Footer.vue"
    import {getAccountPromise} from '../constants'

    const netlifyIdentity = require('netlify-identity-widget');

    Vue.use(BootstrapVue, VueCookies);
    Vue.component('octicon', Octicon);
    let loggedIn = false;
    export default {
        name: 'app',
        components: {
            DrawCard,
            NavBar,
            Footer
        },
        data: function () {
            return {loggedIn: loggedIn, selfRef: 'draw.html'};
        },
        methods: {
            getAccount() {
                return getAccountPromise(netlifyIdentity);
            },
            login() {
                netlifyIdentity.open();
            },
            logout() {
                netlifyIdentity.logout();
            }
        },
        mounted() {
            netlifyIdentity.on('init', user => {
                if (user) {
                    this.loggedIn = true;
                }

            });
            netlifyIdentity.on('login', user => {
                this.loggedIn = true;
            });
            netlifyIdentity.on('logout', user => {
                this.loggedIn = false;
            });
            netlifyIdentity.init();
        }
    }


</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
</style>

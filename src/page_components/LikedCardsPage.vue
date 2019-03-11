<template>
    <div id="app">
        <NavBar v-on:logout="logout" v-on:login="login" :loggedIn="loggedIn" :selfRef="selfRef"></NavBar>
        <CardList :card_list="cards"></CardList>
    </div>
</template>

<script>
    import Vue from 'vue'
    import BootstrapVue from 'bootstrap-vue'
    import Octicon from 'vue-octicon/components/Octicon.vue'
    import 'vue-octicon/icons';
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import NavBar from "../components/NavBar.vue"
    import CardList from "../components/CardList.vue"
    import {API_URL, getAccountPromise} from '../constants'


    const axios = require('axios');

    const netlifyIdentity = require('netlify-identity-widget');

    Vue.use(BootstrapVue);
    Vue.component('octicon', Octicon);
    let loggedIn = false;
    let cards = [];
    export default {
        name: "app",
        components: {
            NavBar,
            CardList
        },
        data: function () {
            return {loggedIn: loggedIn, selfRef: 'liked.html', cards: cards};
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
            },
            fetchSearchResults() {
                const outerThis = this;
                this.getAccount().then(function (account) {
                    const data = {userid: account.id, token: account.token};
                    axios.post(API_URL + "/getLiked", data).then(function (response) {
                        outerThis.cards = response.data;
                    })
                })
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
            this.fetchSearchResults();
        },
        watch: {
            'loggedIn': function () {
                this.fetchSearchResults();
            }
        }
    }
</script>

<style scoped>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        min-height: 100vh;
    }
</style>
<template>
    <div id="app">
        <NavBar v-on:logout="logout" v-on:login="login" :loggedIn="loggedIn" :selfRef="selfRef"></NavBar>
        <b-form-input :state="searchString.length > 2" placeholder="Card name" size="lg" v-model="searchString"></b-form-input>
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
    import {API_URL,JSON_HEADER, getAccountPromise} from '../constants'


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
            return {loggedIn: loggedIn, selfRef: 'search.html', cards: cards, searchString: ""};
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
                const data = {searchString:this.searchString, pageNumber:0, pageSize:50};
                axios.post(API_URL + "/searchForCard", data, JSON_HEADER).then(function (response) {
                    console.log(response);
                    outerThis.cards = response.data.cards;
                });
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
        },
        watch: {
            'searchString': function () {
                this.fetchSearchResults();
            }
        }
    }
</script>

<style scoped>

</style>
<template>
    <div id="app">
        <NavBar v-on:logout="logout" v-on:login="login" :loggedIn="loggedIn" :selfRef="selfRef"></NavBar>
        <b-container>
            <b-jumbotron bg-variant="dark" text-variant="light" header="Tap and Resolve"
                         lead="The Deck-Building Brainstormer">
                <hr>
                <p>
                    Tap and Resolve allows you to discover new Magic The Gathering cards by presenting them to you
                    randomly.
                </p>
                <p>
                    Tap
                    <b-button variant="warning">
                        <octicon name="sync"></octicon>
                    </b-button>
                    to draw a new card,
                    <b-button variant="success">
                        <octicon name="thumbsup"></octicon>
                    </b-button>
                    to like a card, and
                    <b-button variant="danger">
                        <octicon name="thumbsdown"></octicon>
                    </b-button>
                    to dislike a card. You can apply all kinds of filters by clicking on
                    <b-button>
                        <octicon name="settings"></octicon>
                    </b-button>
                    . You can click on a card to get additional information about it.
                </p>
                <p>
                    Your feedback and suggestions help me improve the site. Please feel free to reach out.
                </p>
                <hr>
                <b-row class="justify-content-center mt-5">
                    <b-button size="lg" href="./" class="w-100">Get Started</b-button>
                </b-row>
            </b-jumbotron>
        </b-container>
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
    import NavBar from "../components/NavBar.vue"
    import CardList from "../components/CardList.vue"
    import Footer from "../components/Footer.vue"
    import {getAccountPromise} from '../constants'
    import VueAnalytics from 'vue-analytics'

    Vue.use(VueAnalytics, {
        id: 'UA-135023229-1'
    });

    const netlifyIdentity = require('netlify-identity-widget');

    Vue.use(BootstrapVue);
    Vue.component('octicon', Octicon);
    let loggedIn = false;
    export default {
        name: "app",
        components: {
            NavBar,
            CardList,
            Footer
        },
        data: function () {
            return {loggedIn: loggedIn, selfRef: 'about.html'};
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
            document.title += " - About";
        }
    }
</script>

<style scoped>

</style>
<template>
    <div id="app">
        <NavBar :loggedIn="loggedIn" :selfRef="selfRef" v-on:login="login" v-on:logout="logout"></NavBar>
        <b-container>
            <CardList :card_list="cards" v-on:card-list-open-modal="openCardForModal"></CardList>
        </b-container>
        <CardModal
                :card="selectedCard"
                :cardUserStatus="selectedCardUserStatus"
                :loggedIn="loggedIn"
                v-on:fetchCardStatusById="getUserCardStatus"
                v-on:modal-closed-event="fetchLikedCards"
        ></CardModal>
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
    import CardModal from "../components/CardModal.vue"
    import Footer from "../components/Footer.vue"
    import {API_URL, getAccountPromise} from '../constants'
    import {EMPTY_CARD, JSON_HEADER} from "@/constants";
    import VueAnalytics from 'vue-analytics'

    Vue.use(VueAnalytics, {
        id: 'UA-135023229-1'
    });


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
            CardList,
            CardModal,
            Footer
        },
        data: function () {
            return {
                loggedIn: loggedIn,
                selfRef: 'liked.html',
                cards: cards,
                selectedCardUserStatus: {liked: false, blocked: false},
                selectedCard: EMPTY_CARD
            };
        },
        methods: {
            openCardForModal(card) {
                this.selectedCard = card;
                this.getUserCardStatus(card.id);
                this.$root.$emit('bv::show::modal', 'card_modal')
            },
            getUserCardStatus(card_id) {
                const outerThis = this;
                this.getAccount().then(function (account) {
                    let data = {uuid: card_id, userid: account.id, token: account.token};
                    axios.post(API_URL + "/getUserCardStatus", data, JSON_HEADER)
                        .then(function (response) {
                            if (outerThis.selectedCard.id === card_id) {
                                outerThis.selectedCardUserStatus = response.data;
                            }
                        });
                })
            },
            getAccount() {
                return getAccountPromise(netlifyIdentity);
            },
            login() {
                netlifyIdentity.open();
            },
            logout() {
                netlifyIdentity.logout();
            },
            fetchLikedCards() {
                const outerThis = this;
                this.getAccount().then(function (account) {
                    const data = {userid: account.id, token: account.token};
                    axios.post(API_URL + "/getLiked", data, JSON_HEADER).then(function (response) {
                        outerThis.cards = response.data;
                        outerThis.selectedCard = EMPTY_CARD;
                        outerThis.selectedCardUserStatus = {liked: false, blocked: false};
                    })
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
            this.fetchLikedCards();
        },
        watch: {
            'loggedIn': function () {
                this.fetchLikedCards();
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
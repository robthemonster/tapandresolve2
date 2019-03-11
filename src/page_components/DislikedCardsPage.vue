<template>
    <div id="app">
        <NavBar v-on:logout="logout" v-on:login="login" :loggedIn="loggedIn" :selfRef="selfRef"></NavBar>
        <b-container>
            <CardList v-on:card-list-open-modal="openCardForModal" :card_list="cards"></CardList>
        </b-container>
        <CardModal
                :card="selectedCard"
                :cardUserStatus="selectedCardUserStatus"
                :loggedIn="loggedIn"
                v-on:fetchCardStatusById="getUserCardStatus"
                v-on:modal-closed-event="fetchDislikedCards"
        >

        </CardModal>
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
                selfRef: 'disliked.html',
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
            fetchDislikedCards() {
                const outerThis = this;
                this.getAccount().then(function (account) {
                    const data = {userid: account.id, token: account.token};
                    axios.post(API_URL + "/getBlocked", data).then(function (response) {
                        outerThis.cards = response.data;
                        outerThis.selectedCard = EMPTY_CARD;
                        outerThis.selectedCardUserStatus = {liked: false, blocked: false};
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
            this.fetchDislikedCards();
        },
        watch: {
            'loggedIn': function () {
                this.fetchDislikedCards();
            }
        }
    }
</script>

<style scoped>

</style>